import * as types from './types';

/**
 * Redux action creator to toggleHeading
 * @param {Boolean} show show or hide the form
 * @param {*} mode 'ADD' or 'EDIT'
 * @param {*} label If 'EDIT', label is the key by which we'll retrieve the item from the data structure
 */
export const toggleHeading = (show, mode = 'ADD', label) => ({
	type: types.TOGGLE_HEADING_FORM,
	show,
	mode,
	label
});

export const toggleTimespan = (show, mode = 'ADD') => ({
	type: types.TOGGLE_TIMESPAN_FORM,
	show,
	mode
});

/**
 * Action creator to show a modal
 * @param {String} mode - 'EDIT' or 'ADD'
 * @param {String} listItemType - span or div
 * @param {String} label - list item label
 */
export const showModal = (mode = 'ADD', listItemType, label) => ({
	type: types.SHOW_MODAL,
	label,
	listItemType,
	mode
});

export const closeModal = () => ({
	type: types.CLOSE_MODAL
});

export const handleSuccess = response => ({
	type: types.API_SUCCESS,
	response
});

export const handleError = response => ({
	type: types.API_ERROR,
	response
});
