import * as types from '../actions/types';

const initialState = [];

const smData = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_HEADING:
      let stateClone = [ ...state ];
      stateClone.push(action.payload);
      console.log('Reducer smData value', stateClone);
      return stateClone;
    case types.BUILD_SM_UI:
      console.log('action.payload', action.payload);
      return action.payload;
    default:
      return state;
  }
};

export default smData;
