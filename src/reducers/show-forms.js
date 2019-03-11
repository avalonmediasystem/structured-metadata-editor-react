import * as types from '../actions/types';

const initialState = {
  alert: false,
  disabled: false
};

const showForms = (state = initialState, action) => {
  switch (action.type) {
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
