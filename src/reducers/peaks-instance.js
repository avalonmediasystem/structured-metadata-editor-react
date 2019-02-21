import * as types from '../actions/types';
import WaveformDataUtils from '../services/WaveformDataUtils';
import Peaks from 'peaks.js';

const waveformUtils = new WaveformDataUtils();
const initialState = {};
let newState = null;

const peaksInstance = (state = initialState, action) => {
  switch (action.type) {
    case types.INIT_PEAKS:
      let segments = waveformUtils.initSegments(action.smData);
      let peaksInstance = Peaks.init({
        ...action.options,
        segments: segments
      });
      return peaksInstance;

    case types.INSERT_SEGMENT:
      newState = waveformUtils.insertNewSegment(action.payload, {
        ...state
      });
      return waveformUtils.rebuildPeaks(newState);

    case types.DELETE_SEGMENT:
      newState = waveformUtils.deleteSegment(action.payload, {
        ...state
      });
      return waveformUtils.rebuildPeaks(newState);

    case types.ACTIVATE_SEGMENT:
      return waveformUtils.activateSegment(action.payload, {
        ...state
      });

    case types.SAVE_SEGMENT:
      newState = waveformUtils.deactivateSegment(
        action.payload.clonedSegment.id,
        {
          ...state
        }
      );
      return waveformUtils.saveSegment(action.payload, { ...newState });

    case types.REVERT_SEGMENT:
      newState = waveformUtils.deactivateSegment(action.id, {
        ...state
      });
      return waveformUtils.revertChanges(action.id, action.clone, {
        ...newState
      });

    case types.UPDATE_SEGMENT:
      return waveformUtils.updateSegment(
        action.segment,
        action.property,
        action.value,
        { ...state }
      );

    default:
      return state;
  }
};

export default peaksInstance;
