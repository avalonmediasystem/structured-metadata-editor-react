import * as types from './types';

export const handleEditingTimespans = code => ({
  type: types.IS_EDITING_TIMESPAN,
  code
});
