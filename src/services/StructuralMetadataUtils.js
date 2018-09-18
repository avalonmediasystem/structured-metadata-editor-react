import moment from 'moment';

export default class StructuralMetadataUtils {
  validateBeforeEndTimeOrder(begin, end) {
    if (!(begin || end)) {
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

  validateEndTime (endTime, allSpans) {
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

  findPrecedingSibling(newSpan, siblingSpans) {
    let spansBefore = siblingSpans.filter(span => newSpan.begin >= span.end);
    console.log('spansBefore', spansBefore);
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
   * Insert a new heading as child of an existing heading
   * @param {Object} obj - new heading object to insert
   * @param {Array} json - The entire structured metadata collection
   * @returns {Array} - The updated structured metadata collection, with new object inserted
   */
  insertNewHeader(obj, json) {
    let clonedJson = [...json];
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
   * @param {Array} items - The entire structured metadata collection
   * @returns {Array} - The updated structured metadata collection, with new object inserted
   */
  insertNewTimespan(obj, items) {
    let clonedItems = [...items];
    const targetLabel = obj.timeSpanSelectChildOf;
    let foundItem = this.findItemByLabel(targetLabel, clonedItems);
    const newSpan = this.createSpanObject(obj);

    // Get all spans
    let allSpans = this.getItemsOfType('span', items);
    console.log('allSpans', allSpans);

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
}
