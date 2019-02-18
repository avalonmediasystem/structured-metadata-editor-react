import * as types from './types';

export const handleResponse = code => ({
  type: types.API_RESPONSE,
  code
});

export const closeAlert = () => ({
  type: types.CLOSE_ALERT
});

export const handleListEditing = code => ({
  type: types.EDITING_TIMESPAN,
  code
});
