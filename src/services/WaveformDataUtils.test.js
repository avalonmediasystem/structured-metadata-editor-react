import React from 'react';
import WaveformDataUtils from './WaveformDataUtils';
import Waveform from '../components/Waveform';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { cloneDeep } from 'lodash';
import { testMetadataStructure } from '../test/TestStructure';
import Peaks from 'peaks';

// Mock third party library peaks.js
jest.mock('peaks.js');
import mockPeaks from 'peaks.js';

const waveformUtils = new WaveformDataUtils();
const mockStore = configureMockStore([thunk]);

describe('WaveformDataUtils class', () => {
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
    // Get the current containers for React refs
    const waveformRef = wrapper.find('#waveform-container').instance();
    const audioRef = wrapper.find('audio').instance();
    // Mock the Peaks.init() call for the test
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
  });

  test('initializes peaks with empty metadata structure', () => {
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
    const expected = [
      {
        startTime: 3.32,
        endTime: 10.32,
        labelText: 'Segment 1.1',
        id: '123a-456b-789c-3d',
        color: '#80A590'
      },
      {
        startTime: 11.23,
        endTime: 480,
        labelText: 'Segment 1.2',
        id: '123a-456b-789c-4d',
        color: '#2A5459'
      },
      {
        startTime: 543.24,
        endTime: 900,
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
    expect(mockPeaks.init).toHaveBeenCalledTimes(2);
  });

  describe('tests util functions for Waveform manipulations', () => {
    let peaks;
    let options = {
      container: null,
      mediaElement: null,
      dataUri: null,
      dataUriDefaultFormat: 'json',
      keyboard: true,
      _zoomLevelIndex: 0,
      _zoomLevels: [512, 1024, 2048, 4096]
    };
    beforeEach(() => {
      peaks = Peaks.init(options);
    });

    test('inserts a new segment', () => {
      const newspan = {
        label: 'New span',
        id: '123a-456b-789c-8d',
        begin: '00:09:00.00',
        end: '00:12:00.00',
        type: 'span'
      };
      const value = waveformUtils.insertNewSegment(newspan, peaks);
      expect(value.segments._segments).toHaveLength(3);
      expect(value.segments._segments).toContainEqual({
        startTime: 540,
        endTime: 720,
        id: '123a-456b-789c-8d',
        labelText: 'New span'
      });
    });

    test('deletes an existing segment', () => {
      const value = waveformUtils.deleteSegment('123a-456b-789c-2d', peaks);
      expect(value.segments._segments).toHaveLength(1);
    });
  });
});
