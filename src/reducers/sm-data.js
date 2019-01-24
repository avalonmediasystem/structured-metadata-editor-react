import * as types from '../actions/types';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';

const structrualMetadataUtils = new StructuralMetadataUtils();
const initialState = [];
let stateClone = null;
let newState = null;

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

    case types.ADD_DROP_TARGETS:
      newState = structrualMetadataUtils.determineDropTargets(action.payload, [...state]);
      return newState;

    case types.REMOVE_DROP_TARGETS:
      let noDropTargetsState = structrualMetadataUtils.removeDropTargets([...state]);
      return noDropTargetsState;

    case types.SET_ACTIVE_DRAG_SOURCE:
      stateClone = [...state];
      let target = structrualMetadataUtils.findItem(
        action.id,
        stateClone
      );
      // Put an active flag on list item
      target.active = true;
      return stateClone;

    case types.REMOVE_ACTIVE_DRAG_SOURCES:
      let noActiveDragSourcesState = structrualMetadataUtils.removeActiveDragSources(
        state
      );
      return noActiveDragSourcesState;

    case types.HANDLE_LIST_ITEM_DROP:
      newState = structrualMetadataUtils.handleListItemDrop(
        action.dragSource,
        action.dropTarget,
        state
      );
      return newState;

    default:
      return state;
  }
};

export default smData;
