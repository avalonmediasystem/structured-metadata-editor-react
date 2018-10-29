import * as types from '../actions/types';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';

const structrualMetadataUtils = new StructuralMetadataUtils();
const initialState = [];
let stateClone = null;

const smData = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_HEADING:
      stateClone = [...state];
      stateClone.push(action.payload);
      return stateClone;

    case types.BUILD_SM_UI:
      return action.payload;

    case types.DELETE_ITEM:
      return structrualMetadataUtils.deleteListItem(action.payload, [...state]);
    default:
      return state;
  }
};

export default smData;
