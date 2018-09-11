import * as types from './types';

export function addHeading(values) {
  return {
    type: types.ADD_HEADING,
    payload: values
  };
}

export function buildSMUI(json) {
  return {
    type: types.BUILD_SM_UI,
    payload: json
  };
}
