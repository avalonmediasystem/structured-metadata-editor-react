import * as types from './types';

export function addHeading(values) {
  return {
    type: types.ADD_HEADING,
    payload: values
  };
}

export function buildSMUI(json) {
  return {
    type: types.BUILD_SM_UI,
    payload: json
  };
}

export function deleteItem(item) {
  return {
    type: types.DELETE_ITEM,
    payload: item
  };
}

export function addDropTargets() {
  return {
    type: types.ADD_DROP_TARGETS
  };
}

export function removeDropTargets() {
  return {
    type: types.REMOVE_DROP_TARGETS
  };
}

export function setActiveDragSource(label) {
  return {
    type: types.SET_ACTIVE_DRAG_SOURCE,
    label
  };
}

export function removeActiveDragSources() {
  return {
    type: types.REMOVE_ACTIVE_DRAG_SOURCES
  };
}
