import * as types from '../actions/types';
import WaveformDataUtils from '../services/WaveformDataUtils';

const waveformUtils = new WaveformDataUtils();
const initialState = {};

const peaksInstance = (state = initialState, action) => {
  switch (action.type) {
    case types.INIT_PEAKS:
      return waveformUtils.initPeaks(action.smData, action.options);

    default:
      return state;
  }
};

export default peaksInstance;
