import _ from 'lodash';
import moment from 'moment';

export default class StructuralMetadataUtils {
  /**
   * Helper function which creates an object with the shape our data structure requires
   * @param {Object} obj
   * @return {Object}
   */
  createSpanObject(obj) {
    return {
      type: 'span',
      label: obj.timespanTitle,
      begin: obj.beginTime,
      end: obj.endTime
    };
  }

  /**
   * Remove a targeted list item object from data structure
   * @param {Object} item - span object
   * @param {Array} allItems array of items, usually all current items in the data structure
   * @return {Array}
   */
  deleteListItem(item, allItems) {
    let clonedItems = [...allItems];
    let parentDiv = this.getParentDiv(item, clonedItems);
    let indexToDelete = _.findIndex(parentDiv.items, { label: item.label });

    parentDiv.items.splice(indexToDelete, 1);

    return clonedItems;
  }

  /**
   * Determine whether a time overlaps (or falls between), an existing timespan's range
   * @param {String} time - form input value
   * @param {*} allSpans - all timespans in the data structure
   * @return {Boolean}
   */
  doesTimeOverlap(time, allSpans) {
    const { toMs } = this;
    let valid = true;
    time = toMs(time);

    // Loop through all spans
    for (let i in allSpans) {
      let spanBegin = toMs(allSpans[i].begin);
      let spanEnd = toMs(allSpans[i].end);

      // Illegal time (falls between existing start/end times)
      if (time >= spanBegin && time < spanEnd) {
        valid = false;
        break;
      }
    }
    return valid;
  }

  doesTimespanOverlap(beginTime, endTime, allSpans) {
    const { toMs } = this;
    // Filter out only spans where new begin time is before an existing begin time
    let filteredSpans = allSpans.filter(span => {
      return toMs(beginTime) < toMs(span.begin);
    });
    // Return whether new end time overlaps the next begin time
    return toMs(endTime) > toMs(filteredSpans[0].begin);
  }

  /**
   * @param {String} label - string value to match against
   * @param {Array} items - Array of nested structured metadata objects containing headings and time spans
   * @return {Object} - Object found, or null if none
   */
  findItemByLabel(label, items) {
    let foundItem = null;
    let findItem = items => {
      for (let item of items) {
        if (item.label === label) {
          foundItem = item;
        }
        if (item.items) {
          findItem(item.items);
        }
      }
    };
    findItem(items);

    return foundItem;
  }

  /**
   * Find the <span>s which come before and after new span
   * @param {Object} newSpan - new span object
   * @param {Array} allSpans - all type <span> objects in current structured metadata
   * @returns {Object} - wrapper <span>s object: { before: spanObject, after: spanObject }
   */
  findWrapperSpans(newSpan, allSpans) {
    const { toMs } = this;
    let wrapperSpans = {
      before: null,
      after: null
    };
    let spansBefore = allSpans.filter(
      span => toMs(newSpan.begin) >= toMs(span.end)
    );
    let spansAfter = allSpans.filter(
      span => toMs(newSpan.end) <= toMs(span.begin)
    );

    wrapperSpans.before =
      spansBefore.length > 0 ? spansBefore[spansBefore.length - 1] : null;
    wrapperSpans.after = spansAfter.length > 0 ? spansAfter[0] : null;

    return wrapperSpans;
  }

  /**
   * Get all items in data structure of type 'div' or 'span'
   * @param {Array} json
   * @returns {Array} - all stripped down objects of type in the entire structured metadata collection
   */
  getItemsOfType(type = 'div', items = []) {
    let options = [];

    // Recursive function to search the whole data structure
    let getItems = items => {
      for (let item of items) {
        if (item.type === type) {
          let currentObj = { ...item };
          delete currentObj.items;
          options.push(currentObj);
        }
        if (item.items) {
          getItems(item.items);
        }
      }
    };
    getItems(items);

    return options;
  }

  getParentDiv(child, allItems) {
    let foundDiv = null;

    let findItem = (child, items) => {
      for (let item of items) {
        if (item.items) {
          let childItem = item.items.filter(
            currentChild => child.label === currentChild.label
          );
          // Found it
          if (childItem.length > 0) {
            foundDiv = item;
            break;
          }
          findItem(child, item.items);
        }
      }
    };
    findItem(child, allItems);
    return foundDiv;
  }

  /**
   * Overall logic is to find existing before and after spans for the new object (time flow), and then
   * their parent 'divs' would be valid headings.
   * @param {Object} newSpan - Object which has (at the least) { begin: '00:10:20.33', end: '00:15:88' } properties
   * @param {Object} wrapperSpans Object representing before and after spans of newSpan (if they exist)
   * @param {Array} allItems - All structural metadata items in tree
   * @return {Array} - of valid <div> objects in structural metadata tree
   */
  getValidHeadings(newSpan, wrapperSpans, allItems) {
    let validHeadings = [];

    let findSpanItem = (targetSpan, items) => {
      for (let item of items) {
        // Children items exist
        if (item.items) {
          // Check for a target span match
          let targetSpanMatch = item.items.filter(
            childItem => childItem.label === targetSpan.label
          );
          // Match found
          if (targetSpanMatch.length > 0) {
            // Add parent div to valid array
            validHeadings.push(item);
          }
          // Try deeper in list
          findSpanItem(targetSpan, item.items);
        }
      }
    };

    // There are currently no spans, ALL headings are valid
    if (!wrapperSpans.before && !wrapperSpans.after) {
      // Get all headings and return them
      validHeadings = this.getItemsOfType('div', allItems);
    }

    if (wrapperSpans.before) {
      findSpanItem(wrapperSpans.before, allItems);
    }
    if (wrapperSpans.after) {
      findSpanItem(wrapperSpans.after, allItems);
    }

    return validHeadings;
  }

  /**
   * Insert a new heading as child of an existing heading
   * @param {Object} obj - new heading object to insert
   * @param {Array} allItems - The entire structured metadata collection
   * @returns {Array} - The updated structured metadata collection, with new object inserted
   */
  insertNewHeader(obj, allItems) {
    let clonedItems = [...allItems];
    const targetLabel = obj.headingChildOf;
    let foundDiv =
      this.findItemByLabel(targetLabel, clonedItems) || clonedItems[0];

    // If children exist, add to list
    if (foundDiv) {
      foundDiv.items.unshift({
        type: 'div',
        label: obj.headingTitle,
        items: []
      });
    }

    return clonedItems;
  }

  /**
   * Insert a new timespan as child of an existing heading
   * @param {Object} obj - object of form values submitted
   * @param {Array} allItems - The entire structured metadata collection
   * @returns {Array} - The updated structured metadata collection, with new object inserted
   */
  insertNewTimespan(obj, allItems) {
    let clonedItems = [...allItems];
    let foundDiv = this.findItemByLabel(obj.timespanChildOf, clonedItems);
    const spanObj = this.createSpanObject(obj);
    let insertIndex = 0;

    // If children exist, add to list
    if (foundDiv) {
      let childSpans = foundDiv.items.filter(item => item.type === 'span');

      // Get before and after sibling spans
      let wrapperSpans = this.findWrapperSpans(spanObj, childSpans);

      if (wrapperSpans.before) {
        insertIndex =
          _.findIndex(foundDiv.items, { label: wrapperSpans.before.label }) + 1;
      }
      // Insert new span at appropriate index
      foundDiv.items.splice(insertIndex, 0, spanObj);
    }

    return clonedItems;
  }

  removeActiveDragSources(allItems) {
    let removeActive = parent => {
      if (!parent.items) {
        if (parent.active) {
          parent.active = false;
        }
        return parent;
      }

      parent.items = parent.items
        .map(child => removeActive(child));
      
      return parent;
    }
    let cleanItems = removeActive(allItems[0]);
    console.log('clean active items', cleanItems);
    return [cleanItems];
  }

  /**
   * Recursive function to remove all temporary Drop Target objects from the structured metadata items
   * @param {Array} allItems
   */
  removeDropTargets(allItems) {
    let removeFromTree = (parent, childTypeToRemove) => {
      if (!parent.items) {
        return parent;
      }

      parent.items = parent.items
        .filter(child => child.type !== childTypeToRemove)
        .map(child => removeFromTree(child, childTypeToRemove));

      return parent;
    };
    let cleanItems = removeFromTree(allItems[0], 'optional');
    console.log('cleanItems', [cleanItems]);
    return [cleanItems];
  }

  /**
   * Moment.js helper millisecond converter to make calculations consistent
   * @param {String} strTime form input value
   */
  toMs(strTime) {
    return moment.duration(strTime).asMilliseconds();
  }

  /**
   * Does 'before' time start prior to 'end' time?
   * @param {String} begin form intput value
   * @param {String} end form input value
   * @return {Boolean}
   */
  validateBeforeEndTimeOrder(begin, end) {
    if (!begin || !end) {
      return true;
    }
    if (this.toMs(begin) >= this.toMs(end)) {
      return false;
    }
    return true;
  }
}
