import React from 'react';
import WaveformDataUtils from './WaveformDataUtils';
import Waveform from '../components/Waveform';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
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

  test('initializes peaks segments with empty metadata structure', () => {
    const value = waveformUtils.initSegments([], {});
    expect(value).toBeDefined();
    expect(value).toEqual([]);
  });

  test('initializes peaks segments with metadata structure', () => {
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

    const value = waveformUtils.initSegments(testMetadataStructure);
    expect(value).toBeDefined();
    expect(value).toHaveLength(3);
    expect(value).toEqual(expected);
  });

  describe('tests util functions for Waveform manipulations', () => {
    let peaks;
    const options = {
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

    describe('tests inserting temporary segment', () => {
      test('when current time is in between an existing segment', () => {
        peaks.player.seek(270);
        const value = waveformUtils.insertTempSegment(peaks);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 360.01,
              endTime: 420.01,
              id: 'temp-segment',
              color: '#FBB040',
              editable: true
            })
          ])
        );
      });

      test('when current time is outside of an existing segment without overlapping', () => {
        peaks.player.seek(540);
        const value = waveformUtils.insertTempSegment(peaks);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 540,
              endTime: 600,
              id: 'temp-segment',
              color: '#FBB040',
              editable: true
            })
          ])
        );
      });

      test('when end time of temporary segment overlaps existing segment', () => {
        peaks.player.seek(699.99);
        const value = waveformUtils.insertTempSegment(peaks);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 699.99,
              endTime: 749.99,
              id: 'temp-segment',
              color: '#FBB040',
              editable: true
            })
          ])
        );
      });
    });

    describe('deletes segments when structure metadata items are deleted', () => {
      test('deleting a timespan', () => {
        const item = {
          begin: '00:00:00.00',
          end: '00:06:00.00',
          id: '123a-456b-789c-2d',
          label: 'Sample segment',
          type: 'span'
        };
        const value = waveformUtils.deleteSegments(item, peaks);
        expect(value.segments._segments).toHaveLength(1);
      });

      test('deleting a childless header', () => {
        const item = {
          id: '123a-456b-789c-3d',
          label: 'Sample header',
          type: 'div',
          items: []
        };
        const value = waveformUtils.deleteSegments(item, peaks);
        expect(value.segments._segments).toHaveLength(2);
      });

      test('deleting a header with children', () => {
        const item = {
          id: '123a-456b-789c-3d',
          label: 'Sample header',
          type: 'div',
          items: [
            {
              id: '123a-456b-789c-7d',
              label: 'Sample sub header',
              type: 'div',
              items: []
            },
            {
              begin: '00:12:30.00',
              end: '00:20:59.99',
              id: '123a-456b-789c-9d',
              label: 'Last segment',
              type: 'span'
            }
          ]
        };
        const value = waveformUtils.deleteSegments(item, peaks);
        expect(value.segments._segments).toHaveLength(1);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '123a-456b-789c-2d',
              labelText: 'Sample segment'
            })
          ])
        );
      });
    });

    describe('rebuilds waveform', () => {
      test('when a segment is added in between existing segments', () => {
        peaks.segments.add({
          startTime: 540,
          endTime: 720,
          id: '123a-456b-789c-3d',
          labelText: 'Added segment'
        });

        const value = waveformUtils.rebuildPeaks(peaks);
        expect(value.segments._segments).toHaveLength(3);
        // Tests adding color property to the new segment
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '123a-456b-789c-3d',
              color: '#2A5459'
            })
          ])
        );
        // Tests changing the color of an exisiting segment to adhere to alternating colors in waveform
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '123a-456b-789c-9d',
              color: '#80A590'
            })
          ])
        );
      });
      test('when a segment is deleted', () => {
        peaks.segments.removeById('123a-456b-789c-2d');
        const value = waveformUtils.rebuildPeaks(peaks);
        expect(value.segments._segments).toHaveLength(1);
        // Tests changing the color of an exisiting segment to adhere to alternating colors in waveform
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '123a-456b-789c-9d',
              color: '#80A590'
            })
          ])
        );
      });
    });

    test('activates a segment', () => {
      const value = waveformUtils.activateSegment('123a-456b-789c-2d', peaks);
      expect(value.segments._segments).toHaveLength(2);
      expect(value.segments._segments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: '123a-456b-789c-2d',
            editable: true,
            color: '#FBB040'
          })
        ])
      );
    });

    test('deactivates a segment', () => {
      const value = waveformUtils.deactivateSegment('123a-456b-789c-2d', peaks);
      expect(value.segments._segments).toHaveLength(2);
      expect(value.segments._segments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: '123a-456b-789c-2d',
            editable: false,
            color: '#80A590'
          })
        ])
      );
    });

    test('saves changes to an existing segment', () => {
      const currentState = {
        beginTime: '00:00:00.00',
        endTime: '00:09:59.99',
        clonedSegment: {
          startTime: 0,
          endTime: 360,
          id: '123a-456b-789c-2d',
          labelText: 'Sample segment',
          color: '#80A590'
        }
      };
      const value = waveformUtils.saveSegment(currentState, peaks);
      expect(value.segments._segments).toHaveLength(2);
      expect(value.segments._segments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            startTime: 0,
            endTime: 599.99,
            id: '123a-456b-789c-2d'
          })
        ])
      );
    });

    describe('updates a segment when editing a timespan', () => {
      let segment;
      beforeEach(() => {
        segment = {
          startTime: 0,
          endTime: 360,
          id: '123a-456b-789c-2d',
          labelText: 'Sample segment',
          color: '#80A590'
        };
      });
      test('start time = 00:03:', () => {
        const currentState = { beginTime: '00:03:', endTime: '00:06:00.00' };
        const value = waveformUtils.updateSegment(segment, currentState, peaks);
        expect(value.segments._segments).toHaveLength(2);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 180,
              id: '123a-456b-789c-2d'
            })
          ])
        );
      });

      test('start time = 00:03:59', () => {
        const currentState = { beginTime: '00:03:59', endTime: '00:06:00.00' };
        const value = waveformUtils.updateSegment(segment, currentState, peaks);
        expect(value.segments._segments).toHaveLength(2);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 239,
              id: '123a-456b-789c-2d'
            })
          ])
        );
      });

      test('start time = 00:03:59.99', () => {
        const currentState = {
          beginTime: '00:03:59.99',
          endTime: '00:06:00.00'
        };
        const value = waveformUtils.updateSegment(segment, currentState, peaks);
        expect(value.segments._segments).toHaveLength(2);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 239.99,
              id: '123a-456b-789c-2d'
            })
          ])
        );
      });
    });
  });
});
