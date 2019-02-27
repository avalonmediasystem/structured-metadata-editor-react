import * as types from '../actions/types';
import WaveformDataUtils from '../services/WaveformDataUtils';

const waveformUtils = new WaveformDataUtils();
const initialState = {};
let newState = null;

const peaksInstance = (state = initialState, action) => {
  switch (action.type) {
    case types.INIT_PEAKS:
      return waveformUtils.initPeaks(action.smData, action.options);

    case types.INSERT_SEGMENT:
      newState = waveformUtils.insertNewSegment(action.payload, { ...state });
      return waveformUtils.rebuildPeaks(newState);

    case types.DELETE_SEGMENT:
      newState = waveformUtils.deleteSegments(action.payload, {
        ...state
      });
      return waveformUtils.rebuildPeaks(newState);

    case types.ACTIVATE_SEGMENT:
      return waveformUtils.activateSegment(action.payload, { ...state });

    case types.DEACTIVATE_SEGMENT:
      return waveformUtils.deactivateSegment(action.payload, { ...state });

    case types.REVERT_SEGMENT:
      return waveformUtils.revertChanges(action.id, action.clone, { ...state });

    default:
      return state;
  }
};

export default peaksInstance;
