import _ from 'lodash';

export default class StructuralMetadataUtils {
  createSpanObject(obj) {
    return {
      type: 'span',
      label: obj.timespanInputTitle,
      begin: obj.timespanInputBeginTime,
      end: obj.timespanInputEndTime
    };
  }

  /**
   * Remove a targeted span object from data structure
   * @param {Object} item - span object
   * @param {Array} allItems array of items, usually all current items in the data structure
   */
  deleteSpan(item, allItems) {
    let clonedItems = [...allItems];
    let parentDiv = this.getParentDiv(item, clonedItems);
    let indexToDelete = _.findIndex(parentDiv.items, { label: item.label });

    parentDiv.items.splice(indexToDelete, 1);

    return clonedItems;
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
    let wrapperSpans = {
      before: null,
      after: null
    };
    let spansBefore = allSpans.filter(
      span => this.milliseconds(newSpan.begin) >= this.milliseconds(span.end)
    );
    let spansAfter = allSpans.filter(
      span => this.milliseconds(newSpan.end) <= this.milliseconds(span.begin)
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
    let foundDiv = this.findItemByLabel(targetLabel, clonedItems);

    // If children exist, add to list
    if (foundDiv) {
      foundDiv.items.push({
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
    let foundDiv = this.findItemByLabel(obj.timespanSelectChildOf, clonedItems);
    const spanObj = this.createSpanObject(obj);
    let insertIndex = 0;

    // If children exist, add to list
    if (foundDiv) {
      let childSpans = foundDiv.items.filter(item => item.type === 'span');

      // Get before and after sibling spans
      let wrapperSpans = this.findWrapperSpans(spanObj, childSpans);

      if (wrapperSpans.before) {
        insertIndex = _.findIndex(foundDiv.items, { 'label': wrapperSpans.before.label }) + 1;
      }
      // Insert new span at appropriate index
      foundDiv.items.splice(insertIndex, 0, spanObj);
    }

    return clonedItems;
  }

  /**
   * Helper function which converts '00:00:00' to a float milliseconds result
   * @param {String} timeStr
   * @returns {Number} - float milliseconds value
   */
  milliseconds(timeStr = '0') {
    let timeParts = timeStr.split(':');
    if (timeParts.length === 1) {
      return 0;
    }
    return parseFloat(
      timeParts[0] * 60 * 60 + timeParts[1] * 60 + timeParts[2]
    );
  }

  validateEndTime(endTime, allSpans) {
    let valid = true;

    // Loop through all spans
    for (let i in allSpans) {
      let spanBegin = this.milliseconds(allSpans[i].begin);
      let spanEnd = this.milliseconds(allSpans[i].end);
      let newSpanEnd = this.milliseconds(endTime);

      // Illegal begin time (falls between existing start/end times)
      if (newSpanEnd >= spanBegin && newSpanEnd < spanEnd) {
        valid = false;
        break;
      }
    }
    return valid;
  }

  validateBeforeEndTimeOrder(begin, end) {
    if (!begin || !end) {
      return true;
    }
    if (this.milliseconds(begin) >= this.milliseconds(end)) {
      return false;
    }
    return true;
  }

  validateBeginTime(beginTime, allSpans) {
    let valid = true;

    // Loop through all spans
    for (let i in allSpans) {
      let spanBegin = this.milliseconds(allSpans[i].begin);
      let spanEnd = this.milliseconds(allSpans[i].end);
      let newSpanBegin = this.milliseconds(beginTime);

      // Illegal begin time (falls between existing start/end times)
      if (newSpanBegin >= spanBegin && newSpanBegin < spanEnd) {
        valid = false;
        break;
      }
    }
    return valid;
  }
}