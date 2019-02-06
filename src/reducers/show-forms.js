import * as types from '../actions/types';

const initialState = {
  alert: false
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
        alert: false
      });

    default:
      return state;
  }
};

export default showForms;
