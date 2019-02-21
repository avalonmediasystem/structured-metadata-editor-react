import * as types from './types';

export const initPeaksInstance = (smData, options) => {
  return (dispatch, getState) => {
    dispatch(initPeaks(smData, options));

    const { peaksInstance } = getState();

    if (peaksInstance.events !== undefined) {
      peaksInstance.events.subscribe(segment => {
        dispatch(changeSegment(segment));
      });
    }
  };
};

export function initPeaks(smData, options) {
  return {
    type: types.INIT_PEAKS,
    smData,
    options
  };
}

export function insertNewSegment(span) {
  return {
    type: types.INSERT_SEGMENT,
    payload: span
  };
}

export function deleteSegment(id) {
  return {
    type: types.DELETE_SEGMENT,
    payload: id
  };
}

export function activateSegment(id) {
  return {
    type: types.ACTIVATE_SEGMENT,
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

export function saveSegment(state) {
  return {
    type: types.SAVE_SEGMENT,
    payload: state
  };
}

export function updateSegment(segment, state) {
  return {
    type: types.UPDATE_SEGMENT,
    segment,
    state
  };
}

export function changeSegment(segment) {
  return {
    type: types.DRAGGING_SEGMENT,
    payload: segment
  };
}
