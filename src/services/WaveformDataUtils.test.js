import React from 'react';
import WaveformDataUtils from './WaveformDataUtils';
import Waveform from '../components/Waveform';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { testMetadataStructure } from '../test/TestStructure';

const waveformUtils = new WaveformDataUtils();
const mockStore = configureMockStore([thunk]);

jest.mock('peaks.js', () => {
  const Peaks = jest.fn(opts => {
    let peaks = {};
    peaks.options = {
      ...opts,
      dataUri: 'http://localhost:3123/data/mock-response-waveform.json',
      dataUriDefaultFormat: 'json',
      pointMarkerColor: '#006eb0',
      showPlayheadTime: true,
      zoomWaveformColor: 'rgba(217, 217, 217, 1)'
    };
    return peaks;
  });
  return {
    init: jest.fn(opts => {
      return Peaks(opts);
    })
  };
});

describe('WaveformDataUtils class', () => {
  let store, options;
  beforeEach(() => {
    store = mockStore({});
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
    const waveformRef = wrapper.find('#waveform-container').instance();
    const audioRef = wrapper.find('audio').instance();
    options = {
      container: waveformRef,
      mediaElement: audioRef
    };
  });

  test('initializes peaks with empty metadata structure', () => {
    const value = waveformUtils.initPeaks([], options);
    expect(value).toBeDefined();
    expect(value.options.dataUri).toBe(
      'http://localhost:3123/data/mock-response-waveform.json'
    );
    expect(value.options.segments).toEqual([]);
  });
  test('initializes peaks with metadata structure', () => {
    const value = waveformUtils.initPeaks(testMetadataStructure, options);
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
    expect(value).toBeDefined();
    expect(value.options.dataUri).toBe(
      'http://localhost:3123/data/mock-response-waveform.json'
    );
    expect(value.options.segments).toEqual(expected);
  });
});
