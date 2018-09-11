export default class StructuralMetadataUtils {
  /**
   * Get all headers in the data structure
   * @param {Array} json
   */
  getAllHeaders(json) {
    let headers = [];

    // Recursive function to search the whole data structure
    let getHeaders = items => {
      for (let item of items) {
        if (item.type === 'div') {
          headers.push(item.label);
        }
        if (item.items) {
          getHeaders(item.items);
        }
      }
    };
    getHeaders(json);

    return headers;
  }

  insertNewHeader(obj, json) {
    let clonedJson = [ ...json ];
    const targetLabel = obj.headingSelectChildOf;
    let foundDiv = null;

    // Find the div parent match for new div, by label 
    let findDiv = items => {
      for (let item of items) {
        if (item.label === targetLabel) {
          foundDiv = item;
        }
        if (item.items) {
          findDiv(item.items);
        }
      }
    }
    findDiv(clonedJson);
    console.log('foundDiv', foundDiv);

    // If children exist, add to list
    if (foundDiv) {
      foundDiv.items.push({
        type: "div",
        label: obj.headingInputTitle,
        items: []
      })
    }

    console.log('new clonedJson', clonedJson);
    return clonedJson;
  }
}
