import * as types from '../actions/types';
import WaveformDataUtils from '../services/WaveformDataUtils';
import Peaks from 'peaks.js';
import { fromEvent } from 'rxjs';

const waveformUtils = new WaveformDataUtils();
const initialState = {
  peaks: {},
  events: null,
  segment: null
};
let newPeaks = null;

const peaksInstance = (state = initialState, action) => {
  switch (action.type) {
    case types.INIT_PEAKS:
      let segments = waveformUtils.initSegments(action.smData);
      let peaksInstance = Peaks.init({
        ...action.options,
        segments: segments
      });
      return {
        peaks: peaksInstance,
        events: fromEvent(peaksInstance, 'segments.dragged'),
        segment: { ...state.segment }
      };

    case types.INSERT_SEGMENT:
      newPeaks = waveformUtils.insertNewSegment(action.payload, {
        ...state.peaks
      });
      return {
        ...state,
        peaks: waveformUtils.rebuildPeaks(newPeaks)
      };

    case types.DELETE_SEGMENT:
      newPeaks = waveformUtils.deleteSegment(action.payload, {
        ...state.peaks
      });
      return {
        ...state,
        peaks: waveformUtils.rebuildPeaks(newPeaks)
      };

    case types.ACTIVATE_SEGMENT:
      newPeaks = waveformUtils.activateSegment(action.payload, {
        ...state.peaks
      });
      return {
        ...state,
        peaks: newPeaks
      };

    case types.SAVE_SEGMENT:
      newPeaks = waveformUtils.deactivateSegment(
        action.payload.clonedSegment.id,
        {
          ...state.peaks
        }
      );
      let rebuiltPeaks = waveformUtils.saveSegment(action.payload, {
        ...newPeaks
      });
      return {
        ...state,
        peaks: rebuiltPeaks
      };

    case types.REVERT_SEGMENT:
      newPeaks = waveformUtils.deactivateSegment(action.id, {
        ...state.peaks
      });
      return {
        ...state,
        peaks: waveformUtils.revertChanges(action.id, action.clone, {
          ...newPeaks
        })
      };

    case types.UPDATE_SEGMENT:
      newPeaks = waveformUtils.updateSegment(action.segment, action.state, {
        ...state.peaks
      });
      return {
        ...state,
        peaks: { ...newPeaks }
      };

    case types.DRAGGING_SEGMENT:
      return {
        ...state,
        segment: action.payload
      };

    default:
      return state;
  }
};

export default peaksInstance;
