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

  /**
   *
   * @param {Object} newSpan - Object which has (at the least) { begin: '00:10:20.33', end: '00:15:88' } properties
   * @param {Object} wrapperSpans Object in JSON tree which is the span which ends before new span
   * @param {Array} allItems - All structural metadata items in tree
   * @return {Array} - of valid <div> objects in structural metadata tree
   */
  getValidHeadings(newSpan, wrapperSpans, allItems) {
    let validHeadings = [];
    let precedingFound = false;

    let findSpanItem = (targetSpan, items) => {
      for (let item of items) {
        // Children items exist
        if (item.items) {
          // Check for a match in children items
          let targetSpanMatch = item.items.filter(
            childItem => childItem.label === targetSpan.label
          );
          // Match found for preceding span
          if (targetSpanMatch.length > 0) {
            // Add parent div to valid array
            validHeadings.push(item);

            if (precedingFound) {
              return;
            }

            // Are there any sibling spans in "items" who have a begin time after newSpan's end time?
            // If so, then this is the only possible header
            let siblingAfterSpanMatch = item.items.filter(
              childItem =>
                this.milliseconds(childItem.begin) >=
                this.milliseconds(newSpan.end)
            );

            console.log('siblingAfterSpanMatch', siblingAfterSpanMatch);
            if (siblingAfterSpanMatch.length === 0 && wrapperSpans.after) {
              precedingFound = true;
              // TODO: Get <div> heading for the "after" <span>
              findSpanItem(wrapperSpans.after, allItems);
            } else {
              break;
            }
          }
          // Try deeper in list
          findSpanItem(targetSpan, item.items);
        }
      }
    };
    // Find the preceding span first.  Might not need to find the after span
    findSpanItem(wrapperSpans.before, allItems);

    console.log('validHeadings', validHeadings);
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
    const targetLabel = obj.headingSelectChildOf;
    let foundDiv = this.findItemByLabel(targetLabel, clonedItems);

    // If children exist, add to list
    if (foundDiv) {
      foundDiv.items.push({
        type: 'div',
        label: obj.headingInputTitle,
        items: []
      });
    }

    return clonedItems;
  }

  /**
   * Insert a new timespan as child of an existing heading
   * @param {Object} obj - new timespan object to insert
   * @param {Array} allItems - The entire structured metadata collection
   * @returns {Array} - The updated structured metadata collection, with new object inserted
   */
  insertNewTimespan(obj, allItems) {
    let clonedItems = [...allItems];
    const parentDivLabel = obj.timespanSelectChildOf;
    let foundDiv = this.findItemByLabel(parentDivLabel, clonedItems);

    // If children exist, add to list
    if (foundDiv) {
      foundDiv.items.push(this.createSpanObject(obj));
    }

    return clonedItems;
  }

  /**
   * Helper function which converts '00:00:00' to a float milliseconds result
   * @param {String} timeStr
   * @returns {Number} - float milliseconds value
   */
  milliseconds(timeStr) {
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
