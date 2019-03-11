import * as types from '../actions/types';

const initialState = {
  disabled: false
};

const showForms = (state = initialState, action) => {
  switch (action.type) {
    case types.IS_EDITING_TIMESPAN:
      if (action.code === 0) {
        return Object.assign({}, state, {
          disabled: true
        });
      }

      return Object.assign({}, state, {
        disabled: false
      });

    default:
      return state;
  }
};

export default showForms;
