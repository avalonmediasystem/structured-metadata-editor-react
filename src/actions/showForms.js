import * as types from './types';

export const toggleHeading = show => ({
  type: types.TOGGLE_HEADING_FORM,
  show: show
});

export const toggleTimespan = show => ({
  type: types.TOGGLE_TIMESPAN_FORM,
  show
});
