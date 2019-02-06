import * as types from './types';

export function initPeaks(smData, peaks, options) {
  return {
    type: types.INIT_PEAKS,
    smData,
    peaks,
    options
  };
}
