export const UNAUTHORIZED_ACCESS = 'Unauthorized to access the masterfile';
export const MASTERFILE_NOT_FOUND = 'Requested masterfile not found';
export const SAVED_MASTERFILE_SUCCESS = 'Successfully saved to masterfile';
export const NETWORK_ERROR = 'Network error, please try again';
export const FETCH_STRUCTURED_DATA_ERROR =
  'There was an error fetching the Structured Metadata from server';
export const PEAKJS_INITIALIZE_ERROR =
  'There was an error initializing the PeakJS waveform';

/**
 * Helper function which prepares a configuration object to feed the AlertContainer component
 * @param {number} status Code for response
 */
export function configureAlert(status) {
  let alertObj = { alertStyle: 'danger' };

  if (status === 401) {
    alertObj.message = UNAUTHORIZED_ACCESS;
  } else if (status === 404) {
    alertObj.message = MASTERFILE_NOT_FOUND;
  } else if (status >= 200 && status < 300) {
    alertObj.alertStyle = 'success';
    alertObj.message = SAVED_MASTERFILE_SUCCESS;
  } else if (status === -2) {
    alertObj.message = FETCH_STRUCTURED_DATA_ERROR;
  } else if (status === -3) {
    alertObj.message = PEAKJS_INITIALIZE_ERROR;
  } else {
    alertObj.message = NETWORK_ERROR;
  }

  return alertObj;
}
