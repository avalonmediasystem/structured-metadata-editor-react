import * as types from '../actions/types';

const initialState = {
  editingDisabled: false,
  structureRetrieved: false,
  waveformRetrieved: false
};

const forms = (state = initialState, action) => {
  switch (action.type) {
    case types.IS_EDITING_TIMESPAN:
      if (action.code === 0) {
        return Object.assign({}, state, {
          editingDisabled: true
        });
      }

      return Object.assign({}, state, {
        editingDisabled: false
      });

    case types.RETRIEVED_STRUCTURE:
      if (action.code === 0) {
        return Object.assign({}, state, {
          structureRetrieved: true
        });
      }
      break;

    case types.RETRIEVED_WAVEFORM:
      if (action.code === 0) {
        return Object.assign({}, state, {
          waveformRetrieved: true
        });
      }
      break;

    default:
      return state;
  }
};

export default forms;
