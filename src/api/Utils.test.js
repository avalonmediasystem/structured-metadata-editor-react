import mockAxios from 'axios';
import APIUtils, { useLocalData } from '../api/Utils';

const apiUtils = new APIUtils();

describe('Tests Utils module', () => {
  let waveformUrl;
  beforeAll(() => {
    waveformUrl = useLocalData
      ? 'http://localhost:3123/data/mock-response-waveform.json'
      : 'https://spruce.dlib.indiana.edu/master_files/j3860704z/waveform.json';
  });
  test('axios get request', () => {
    mockAxios.get.mockImplementationOnce(() => {
      Promise.resolve({
        request: {
          responseURL: waveformUrl
        }
      });
    });
    apiUtils.getRequest('waveform.json');
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(waveformUrl, {
      headers: { map: { 'content-type': 'application/json' } }
    });
  });
  test('axios post request', () => {
    apiUtils.postRequest('waveform.json', {});
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
    expect(mockAxios.post).toHaveBeenCalledWith(
      waveformUrl,
      {},
      {
        headers: { map: { 'content-type': 'application/json' } }
      }
    );
  });
});
