import axios from 'axios';

export const BASE_URL = 'https://spruce.dlib.indiana.edu';

// Masterfile ID on the server
export const masterFileID = 'kd17ct01m';

// Default headers for API calls
export const defaultHeaders = new Headers();
defaultHeaders.append('Content-Type', 'application/json');

export default class APIUtils {
  /**
   * Construct GET request with parameters,
   * @param {String} urlEndPoint
   * @param {Headers} headers
   */
  getRequest(urlEndPoint, headers = defaultHeaders) {
    return axios.get(
      `${BASE_URL}/master_files/${masterFileID}/${urlEndPoint}`,
      {
        headers: headers
      }
    );
  }

  /**
   * Construct POST request with parameters,
   * @param {String} urlEndPoint
   * @param {JSON} data - JSON data posting to the server
   * @param {Headers} headers
   */
  postRequest(urlEndPoint, data, headers = defaultHeaders) {
    return axios.post(
      `${BASE_URL}/master_files/${masterFileID}/${urlEndPoint}`,
      data,
      {
        headers: headers
      }
    );
  }
}
