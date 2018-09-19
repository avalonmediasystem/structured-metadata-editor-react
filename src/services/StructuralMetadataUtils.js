export default class StructuralMetadataUtils {
  createSpanObject(obj) {
    return {
      type: 'span',
      label: obj.timeSpanInputTitle,
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
   * Find and return the sibling span which ends right before new span begins
   * @param {Object} newSpan - new span object
   * @param {Array} allSpans - all span objects in current structured metadata
   * @returns {Object} - preceding sibling object (if it exists)
   */
  findPrecedingSibling(newSpan, allSpans) {
    let precedingSpan = {};
    let spansBefore = allSpans.filter(
      span => this.milliseconds(newSpan.begin) >= this.milliseconds(span.end)
    );
    if (spansBefore.length > 0) {
      precedingSpan = spansBefore[spansBefore.length - 1];
    }
    return precedingSpan;
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

  getValidHeadings(newSpan, precedingSpan, allItems) {
    // Find div which is directly above preceding span
    let divAbovePrecedingSpan = null;
    let validHeadings = [];

    let findItem = items => {
      for (let item of items) {
        if (item.items) {
          let precedingSpanMatch = item.items.filter(
            childItem => childItem.label === precedingSpan.label
          );
          // Match found for preceding span
          if (precedingSpanMatch.length > 0) {
            // Add parent div to valid array
            validHeadings.push(item);

            // Are there any items with type span who have a begin time after newSpan's end time?
            let afterSpanMatch = item.items.filter(
              childItem =>
                this.milliseconds(childItem.begin) >=
                this.milliseconds(newSpan.end)
            );
            console.log('afterSpanMatch', afterSpanMatch);

            if (afterSpanMatch.length === 0) {
              // TODO: get next heading after end time of newSpan, and newSpan could be the first child
              // of that heading
            } else {
              break;
            }
          }
          // Try deeper in list
          findItem(item.items);
        }
      }
    };
    findItem(allItems);

    return validHeadings;
  }

  /**
   * Insert a new heading as child of an existing heading
   * @param {Object} obj - new heading object to insert
   * @param {Array} allItems - The entire structured metadata collection
   * @returns {Array} - The updated structured metadata collection, with new object inserted
   */
  insertNewHeader(obj, allItems) {
    let clonedJson = [...allItems];
    const targetLabel = obj.headingSelectChildOf;
    let foundDiv = this.findItemByLabel(targetLabel, clonedJson);

    // If children exist, add to list
    if (foundDiv) {
      foundDiv.items.push({
        type: 'div',
        label: obj.headingInputTitle,
        items: []
      });
    }

    return clonedJson;
  }

  /**
   * Insert a new timespan as child of an existing heading
   * @param {Object} obj - new timespan object to insert
   * @param {Array} allItems - The entire structured metadata collection
   * @returns {Array} - The updated structured metadata collection, with new object inserted
   */
  insertNewTimespan(obj, allItems) {
    let clonedItems = [...allItems];
    const parentDivLabel = obj.timeSpanSelectChildOf;
    let foundDiv = this.findItemByLabel(parentDivLabel, clonedItems);
    const newSpan = this.createSpanObject(obj);

    // Get all spans
    let allSpans = this.getItemsOfType('span', allItems);
    console.log('allSpans', allSpans);

    // Find the span which ends right before start of our new span,
    // so we know where to place it.
    let precedingSpan = this.findPrecedingSibling(newSpan, allSpans);
    console.log('precedingSpan', precedingSpan);

    // No preceding item exists.  Insert at beginning of list?
    if (Object.keys(precedingSpan).length === 0) {
    }

    let validHeadings = this.getValidHeadings(newSpan, precedingSpan, allItems);

    return clonedItems;
  }

  /**
   * Helper function which converts '00:00:00' to a float milliseconds result
   * @param {String} timeStr
   * @returns {Number} - float milliseconds value
   */
  milliseconds(timeStr) {
    let timeParts = timeStr.split(':');
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
