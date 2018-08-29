import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import showForms from './show-forms';

export default combineReducers({
  showForms,
  form: formReducer
});
