import * as types from '../actions/types';

const initialState = {
  heading: false,
  timespan: false,
  modal: false,
  alert: false
};

const showForms = (state = initialState, action) => {
  switch (action.type) {
    case types.TOGGLE_HEADING_FORM:
      return Object.assign({}, state, {
        heading: action.show,
        mode: action.mode,
        label: action.label
      });
    case types.TOGGLE_TIMESPAN_FORM:
      return Object.assign({}, state, {
        timespan: action.show,
        mode: action.mode
      });
    case types.SHOW_MODAL:
      return Object.assign({}, state, {
        modal: true,
        mode: action.mode,
        listItemType: action.listItemType,
        label: action.label
      });
    case types.CLOSE_MODAL:
      return Object.assign({}, state, {
        modal: false
      });

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
