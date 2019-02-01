import StructuralMetadataUtils from './StructuralMetadataUtils';

const structuralMetadataUtils = new StructuralMetadataUtils();

/**
 * Load existing form values to state, if in 'EDIT' mode
 */
export function getExistingFormValues(id, smData) {
  let item = structuralMetadataUtils.findItem(id, smData);

  // Heading
  if (item.type === 'div') {
    return {
      headingTitle: item.label
    };
  }

  // Timespan
  if (item.type === 'span') {
    let parentDiv = structuralMetadataUtils.getParentDiv(item, smData);

    return {
      beginTime: item.begin,
      endTime: item.end,
      timespanChildOf: parentDiv ? parentDiv.id : '',
      timespanTitle: item.label
    };
  }
}
