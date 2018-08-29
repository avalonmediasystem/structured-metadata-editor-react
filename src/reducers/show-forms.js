import * as types from '../actions/types';

const initialState = {
  heading: false,
  timespan: false
};

const showForms = (state = initialState, action) => {
  switch (action.type) {
    case types.TOGGLE_HEADING_FORM:
      return Object.assign({}, state, {
        heading: action.show
      });
    case types.TOGGLE_TIMESPAN_FORM:
      return Object.assign({}, state, {
        timespan: action.show
      });
    default:
      return state;
  }
};

export default showForms;
