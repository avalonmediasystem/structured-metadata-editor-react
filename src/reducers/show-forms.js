import * as types from '../actions/types';

const initialState = {
	heading: false,
	timespan: false,
	modal: false
};

const showForms = (state = initialState, action) => {
	switch (action.type) {
		case types.TOGGLE_HEADING_FORM:
			return Object.assign({}, state, {
				heading: action.show,
				mode: action.mode,
				label: action.label
			});
		case types.TOGGLE_TIMESPAN_FORM:
			return Object.assign({}, state, {
				timespan: action.show,
				mode: action.mode
			});
		case types.SHOW_MODAL:
			return Object.assign({}, state, {
				modal: true,
				mode: action.mode,
				listItemType: action.listItemType,
				label: action.label
			});
		case types.CLOSE_MODAL:
			return Object.assign({}, state, {
				modal: false
			});

		case types.API_SUCCESS:
			console.log('From show-forms reducer success');
			return Object.assign({}, state, {
				message: action.response
			});

		case types.API_ERROR:
			console.log('From show-forms reducer error');
			return Object.assign({}, state, {
				message: action.response
			});

		default:
			return state;
	}
};

export default showForms;
