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

export function getValidationBeginState(beginTime, allSpans) {
  if (!beginTime || beginTime.indexOf(':') === -1) {
    return null;
  }

  const validFormat = structuralMetadataUtils.validTimeFormat(beginTime);
  const validBeginTime = structuralMetadataUtils.doesTimeOverlap(
    beginTime,
    allSpans
  );

  if (validFormat && validBeginTime) {
    return 'success';
  }
  if (!validFormat || !validBeginTime) {
    return 'error';
  }
  return null;
}

export function getValidationEndState(beginTime, endTime, allSpans) {
  if (!endTime || endTime.indexOf(':') === -1) {
    return null;
  }

  const validFormat = structuralMetadataUtils.validTimeFormat(endTime);
  const validEndTime = structuralMetadataUtils.doesTimeOverlap(
    endTime,
    allSpans
  );
  const validOrdering = structuralMetadataUtils.validateBeforeEndTimeOrder(
    beginTime,
    endTime
  );
  const doesTimespanOverlap = structuralMetadataUtils.doesTimespanOverlap(
    beginTime,
    endTime,
    allSpans
  );

  if (validFormat && validEndTime && validOrdering && !doesTimespanOverlap) {
    return 'success';
  }
  if (!validFormat || !validEndTime || !validOrdering || doesTimespanOverlap) {
    return 'error';
  }
  return null;
}

export function getValidationTitleState(title) {
  if (title.length > 2) {
    return 'success';
  }
  if (title.length > 0) {
    return 'error';
  }
  return null;
}

/**
 * Validation logic for a valid title here
 * @param {String} title
 */
export function isTitleValid(title) {
  return title.length > 0;
}

/**
 * Validates that the begin and end time span values are valid separately, and together
 * in the region which they will create.
 *
 * This function also preps handy feedback messages we might want to display to the user
 */
export function validTimespans(beginTime, endTime, allSpans, smData) {
  // Valid formats?
  if (!structuralMetadataUtils.validTimeFormat(beginTime)) {
    return {
      valid: false,
      message: 'Invalid begin time format'
    };
  }
  if (!structuralMetadataUtils.validTimeFormat(endTime)) {
    return {
      valid: false,
      message: 'Invalid end time format'
    };
  }
  // Any individual overlapping?
  if (!structuralMetadataUtils.doesTimeOverlap(beginTime, allSpans)) {
    return {
      valid: false,
      message: 'Begin time overlaps an existing timespan region'
    };
  }
  if (!structuralMetadataUtils.doesTimeOverlap(endTime, allSpans)) {
    return {
      valid: false,
      message: 'End time overlaps an existing timespan region'
    };
  }
  // Begin comes before end?
  if (!structuralMetadataUtils.validateBeforeEndTimeOrder(beginTime, endTime)) {
    return {
      valid: false,
      message: 'Begin time must start before end time'
    };
  }
  // Timespan range overlaps an existing timespan?
  if (
    structuralMetadataUtils.doesTimespanOverlap(beginTime, endTime, allSpans)
  ) {
    return {
      valid: false,
      message: 'New timespan region overlaps an existing timespan region'
    };
  }

  // Success!
  return { valid: true };
}
