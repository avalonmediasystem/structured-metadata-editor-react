import React from 'react';
import WaveformDataUtils from './WaveformDataUtils';
import Waveform from '../components/Waveform';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { testMetadataStructure } from '../test/TestStructure';

jest.mock('peaks.js');
import mockPeaks from 'peaks.js';

const waveformUtils = new WaveformDataUtils();
const mockStore = configureMockStore([thunk]);

describe('WaveformDataUtils class', () => {
  let waveformRef, audioRef;
  beforeEach(() => {
    const store = mockStore({});
    const waveformContainer = React.createRef();
    const mediaPlayer = React.createRef();
    const wrapper = mount(
      <Provider store={store}>
        <Waveform
          waveformRef={() => {}}
          mediaPlayerRef={() => {}}
          ref={waveformContainer}
          ref={mediaPlayer}
        />
      </Provider>
    );
    waveformRef = wrapper.find('#waveform-container').instance();
    audioRef = wrapper.find('audio').instance();
  });

  test('initializes peaks with empty metadata structure', () => {
    mockPeaks.init.mockImplementationOnce(opts => {
      return {
        options: {
          ...opts,
          container: waveformRef,
          mediaElement: audioRef,
          dataUri: 'http://localhost:3123/data/mock-response-waveform.json',
          dataUriDefaultFormat: 'json'
        }
      };
    });
    const value = waveformUtils.initPeaks([], {});
    expect(value).toBeDefined();
    expect(value.options.container).not.toBeNull();
    expect(value.options.dataUri).toBe(
      'http://localhost:3123/data/mock-response-waveform.json'
    );
    expect(value.options.segments).toEqual([]);
    expect(mockPeaks.init).toHaveBeenCalledTimes(1);
  });
  test('initializes peaks with metadata structure', () => {
    mockPeaks.init.mockImplementationOnce(opts => {
      return {
        options: {
          ...opts,
          container: waveformRef,
          mediaElement: audioRef,
          dataUri: 'http://localhost:3123/data/mock-response-waveform.json',
          dataUriDefaultFormat: 'json'
        }
      };
    });
    const expected = [
      {
        startTime: 3.32,
        endTime: 10.32,
        editable: false,
        labelText: 'Segment 1.1',
        id: '123a-456b-789c-3d',
        color: '#80A590'
      },
      {
        startTime: 11.23,
        endTime: 480,
        editable: false,
        labelText: 'Segment 1.2',
        id: '123a-456b-789c-4d',
        color: '#2A5459'
      },
      {
        startTime: 543.24,
        endTime: 900,
        editable: false,
        labelText: 'Segment 2.1',
        id: '123a-456b-789c-8d',
        color: '#80A590'
      }
    ];
    const value = waveformUtils.initPeaks(testMetadataStructure, {});
    expect(value).toBeDefined();
    expect(value.options.dataUri).toBe(
      'http://localhost:3123/data/mock-response-waveform.json'
    );
    expect(value.options.segments).toEqual(expected);
    expect(value.options.segments).toHaveLength(3);
    expect(value.options.segments).toContainEqual({
      startTime: 11.23,
      endTime: 480,
      editable: false,
      labelText: 'Segment 1.2',
      id: '123a-456b-789c-4d',
      color: '#2A5459'
    });
  });
});
