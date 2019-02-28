import * as types from '../actions/types';

const initialState = {
  alert: false,
  disabled: false
};

const showForms = (state = initialState, action) => {
  switch (action.type) {
    case types.API_RESPONSE:
      return Object.assign({}, state, {
        statusCode: action.code,
        alert: true
      });

    case types.CLOSE_ALERT:
      return Object.assign({}, state, {
        alert: false,
        blocking: false
      });

    case types.IS_EDITING_TIMESPAN:
      if (action.code === 0) {
        return Object.assign({}, state, {
          statusCode: action.code,
          disabled: true
        });
      }

      return Object.assign({}, state, {
        statusCode: action.code,
        disabled: false
      });

    default:
      return state;
  }
};

export default showForms;
