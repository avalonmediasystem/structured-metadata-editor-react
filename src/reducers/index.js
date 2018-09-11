import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import showForms from './show-forms';
import smData from './sm-data';

export default combineReducers({
  showForms,
  smData,
  form: formReducer
});
