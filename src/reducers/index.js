import { combineReducers } from 'redux';
import showForms from './show-forms';
import smData from './sm-data';
import peaksInstance from './peaks-instance';

export default combineReducers({
  showForms,
  smData,
  peaksInstance
});
