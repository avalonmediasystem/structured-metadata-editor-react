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
      state.on('segments.dragged', function(segment) {
        console.log(
          'Label: ',
          segment.labelText,
          ' | Start time: ',
          segment.startTime,
          ' | End time: ',
          segment.endTime
        );
      });
      return waveformUtils.activateSegment(action.payload, {
        ...state
      });

    case types.DEACTIVATE_SEGMENT:
      return waveformUtils.deactivateSegment(action.payload, {
        ...state
      });

    case types.REVERT_SEGMENT:
      return waveformUtils.revertChanges(action.id, action.clone, {
        ...state
      });

    default:
      return state;
  }
};

export default peaksInstance;
