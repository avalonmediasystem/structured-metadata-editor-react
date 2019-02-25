import * as types from '../actions/types';
import WaveformDataUtils from '../services/WaveformDataUtils';
import Peaks from 'peaks.js';
import { fromEvent } from 'rxjs';

const waveformUtils = new WaveformDataUtils();
const initialState = {
  peaks: {},
  events: null
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
        events: { ...state.events }
      };

    case types.BIND_PEAKS:
      return {
        peaks: { ...state.peaks },
        events: fromEvent(action.payload, 'segments.dragged')
      };

    case types.INSERT_SEGMENT:
      newPeaks = waveformUtils.insertNewSegment(action.payload, {
        ...state.peaks
      });
      return {
        peaks: waveformUtils.rebuildPeaks(newPeaks),
        events: { ...state.events }
      };

    case types.DELETE_SEGMENT:
      newPeaks = waveformUtils.deleteSegment(action.payload, {
        ...state.peaks
      });
      return {
        peaks: waveformUtils.rebuildPeaks(newPeaks),
        events: { ...state.events }
      };

    case types.ACTIVATE_SEGMENT:
      newPeaks = waveformUtils.activateSegment(action.payload, {
        ...state.peaks
      });
      return {
        peaks: newPeaks,
        events: { ...state.events }
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
        peaks: rebuiltPeaks,
        events: fromEvent(rebuiltPeaks, 'segments.dragged')
      };

    case types.REVERT_SEGMENT:
      newPeaks = waveformUtils.deactivateSegment(action.id, {
        ...state.peaks
      });
      return {
        peaks: waveformUtils.revertChanges(action.id, action.clone, {
          ...newPeaks
        }),
        events: { ...state.events }
      };

    case types.UPDATE_SEGMENT:
      newPeaks = waveformUtils.updateSegment(
        action.segment,
        action.property,
        action.value,
        { ...state.peaks }
      );
      return {
        peaks: { ...newPeaks },
        events: { ...state.events }
      };

    default:
      return state;
  }
};

export default peaksInstance;
