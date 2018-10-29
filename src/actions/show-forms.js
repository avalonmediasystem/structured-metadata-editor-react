import * as types from './types';

/**
 * Redux action creator to toggleHeading
 * @param {Boolean} show show or hide the form
 * @param {*} mode 'ADD' or 'EDIT'
 * @param {*} label If 'EDIT', label is the key by which we'll retrieve the item from the data structure
 */
export const toggleHeading = (show, mode='ADD', label) => ({
  type: types.TOGGLE_HEADING_FORM,
  show,
  mode,
  label
});

export const toggleTimespan = (show, mode='ADD') => ({
  type: types.TOGGLE_TIMESPAN_FORM,
  show,
  mode
});
