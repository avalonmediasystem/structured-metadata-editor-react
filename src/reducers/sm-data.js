import * as types from '../actions/types';

const initialState = [];

const smData = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_HEADING:
      let stateClone = [...state];
      stateClone.push(action.payload);
      return stateClone;

    case types.BUILD_SM_UI:
      return action.payload;

    case types.DELETE_ITEM:
      return state;

    default:
      return state;
  }
};

export default smData;
