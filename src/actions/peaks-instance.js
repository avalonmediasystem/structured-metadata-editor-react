import * as types from './types';

export function initPeaks(smData, options) {
  return {
    type: types.INIT_PEAKS,
    smData,
    options
  };
}

export function insertNewSegment(smData) {
  return {
    type: types.INSERT_SEGMENT,
    payload: smData
  };
}

export function deleteSegment(id, smData) {
  return {
    type: types.DELETE_SEGMENT,
    id,
    smData
  };
}

export function activateSegment(id) {
  return {
    type: types.ACTIVATE_SEGMENT,
    payload: id
  };
}

export function deactivateSegment(id) {
  return {
    type: types.DEACTIVATE_SEGMENT,
    payload: id
  };
}

export function revertSegment(id, clone) {
  return {
    type: types.REVERT_SEGMENT,
    id,
    clone
  };
}
