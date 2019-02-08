import * as types from './types';

export function initPeaks(smData, options) {
  return {
    type: types.INIT_PEAKS,
    smData,
    options
  };
}
