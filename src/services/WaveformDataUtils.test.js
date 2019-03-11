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
        id: '123a-456b-789c-9d',
        begin: '00:09:00.00',
        end: '00:12:00.00',
        type: 'span'
      };
      const value = waveformUtils.insertNewSegment(newspan, peaks);
      expect(value.segments._segments).toHaveLength(4);
      expect(value.segments._segments).toContainEqual({
        startTime: 540,
        endTime: 720,
        id: '123a-456b-789c-9d',
        labelText: 'New span'
      });
    });

    describe('tests inserting temporary segment', () => {
      test('when current time is at zero', () => {
        const value = waveformUtils.insertTempSegment(peaks);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 0,
              endTime: 3.31,
              id: 'temp-segment',
              color: '#FBB040',
              editable: true
            })
          ])
        );
        expect(value.player.getCurrentTime()).toEqual(0);
      });

      test('when current time is in between an existing segment', () => {
        peaks.player.seek(450);
        const value = waveformUtils.insertTempSegment(peaks);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 480.01,
              endTime: 540.01,
              id: 'temp-segment',
              color: '#FBB040',
              editable: true
            })
          ])
        );
        expect(value.player.getCurrentTime()).toEqual(480.01);
      });

      test('when current time is at the end time of an existing timespan', () => {
        peaks.player.seek(480.0);
        const value = waveformUtils.insertTempSegment(peaks);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 480.01,
              endTime: 540.01,
              id: 'temp-segment',
              color: '#FBB040',
              editable: true
            })
          ])
        );
        expect(value.player.getCurrentTime()).toEqual(480.01);
      });

      test('when current time is at the begint time of an existing timespan', () => {
        peaks.player.seek(543.24);
        const value = waveformUtils.insertTempSegment(peaks);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 900.01,
              endTime: 960.01,
              id: 'temp-segment',
              color: '#FBB040',
              editable: true
            })
          ])
        );
        expect(value.player.getCurrentTime()).toEqual(900.01);
      });

      test('when end time of temporary segment overlaps existing segment', () => {
        peaks.player.seek(520);
        const value = waveformUtils.insertTempSegment(peaks);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 520,
              endTime: 543.23,
              id: 'temp-segment',
              color: '#FBB040',
              editable: true
            })
          ])
        );
        expect(value.player.getCurrentTime()).toEqual(520);
      });
    });

    describe('deletes segments when structure metadata items are deleted', () => {
      test('deleting a timespan', () => {
        const item = {
          type: 'span',
          label: 'Segment 1.2',
          id: '123a-456b-789c-4d',
          begin: '00:00:11.23',
          end: '00:08:00.00'
        };
        const value = waveformUtils.deleteSegments(item, peaks);
        expect(value.segments._segments).toHaveLength(2);
      });

      test('deleting a childless header', () => {
        const item = {
          type: 'div',
          label: 'Sub-Segment 1.1',
          id: '123a-456b-789c-2d',
          items: []
        };
        const value = waveformUtils.deleteSegments(item, peaks);
        expect(value.segments._segments).toHaveLength(3);
      });

      test('deleting a header with children', () => {
        const item = {
          type: 'div',
          label: 'Sub-Segment 2.1',
          id: '123a-456b-789c-6d',
          items: [
            {
              type: 'div',
              label: 'Sub-Segment 2.1.1',
              id: '123a-456b-789c-7d',
              items: []
            },
            {
              type: 'span',
              label: 'Segment 2.1',
              id: '123a-456b-789c-8d',
              begin: '00:09:03.24',
              end: '00:15:00.00'
            }
          ]
        };
        const value = waveformUtils.deleteSegments(item, peaks);
        expect(value.segments._segments).toHaveLength(2);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '123a-456b-789c-4d',
              labelText: 'Segment 1.2'
            })
          ])
        );
      });
    });

    describe('rebuilds waveform', () => {
      test('when a segment is added in between existing segments', () => {
        peaks.segments.add({
          startTime: 500,
          endTime: 540,
          id: '123a-456b-789c-9d',
          labelText: 'Added segment'
        });

        const value = waveformUtils.rebuildPeaks(peaks);
        expect(value.segments._segments).toHaveLength(4);
        // Tests adding color property to the new segment
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '123a-456b-789c-9d',
              color: '#80A590'
            })
          ])
        );
        // Tests changing the color of an exisiting segment to adhere to alternating colors in waveform
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '123a-456b-789c-8d',
              color: '#2A5459'
            })
          ])
        );
      });
      test('when a segment is deleted', () => {
        peaks.segments.removeById('123a-456b-789c-4d');
        const value = waveformUtils.rebuildPeaks(peaks);
        expect(value.segments._segments).toHaveLength(2);
        // Tests changing the color of an exisiting segment to adhere to alternating colors in waveform
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: '123a-456b-789c-8d',
              color: '#2A5459'
            })
          ])
        );
      });
    });

    test('activates a segment', () => {
      const value = waveformUtils.activateSegment('123a-456b-789c-4d', peaks);
      expect(value.segments._segments).toHaveLength(3);
      expect(value.segments._segments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: '123a-456b-789c-4d',
            editable: true,
            color: '#FBB040'
          })
        ])
      );
    });

    test('deactivates a segment', () => {
      const value = waveformUtils.deactivateSegment('123a-456b-789c-4d', peaks);
      expect(value.segments._segments).toHaveLength(3);
      expect(value.segments._segments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: '123a-456b-789c-4d',
            editable: false,
            color: '#2A5459'
          })
        ])
      );
    });

    test('saves changes to an existing segment', () => {
      const currentState = {
        beginTime: '00:00:10.33',
        endTime: '00:08:00.00',
        clonedSegment: {
          startTime: 11.23,
          endTime: 480,
          id: '123a-456b-789c-4d',
          labelText: 'Segment 1.2',
          color: '#2A5459'
        }
      };
      const value = waveformUtils.saveSegment(currentState, peaks);
      expect(value.segments._segments).toHaveLength(3);
      expect(value.segments._segments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            startTime: 10.33,
            endTime: 480,
            id: '123a-456b-789c-4d'
          })
        ])
      );
    });

    describe('updates a segment when editing a timespan', () => {
      let segment;
      beforeEach(() => {
        segment = {
          startTime: 11.23,
          endTime: 480,
          id: '123a-456b-789c-4d',
          labelText: 'Segment 1.2',
          color: '#2A5459'
        };
      });
      test('start time = 00:03:', () => {
        const currentState = { beginTime: '00:03:', endTime: '00:08:00.00' };
        const value = waveformUtils.updateSegment(segment, currentState, peaks);
        expect(value.segments._segments).toHaveLength(3);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 180,
              id: '123a-456b-789c-4d'
            })
          ])
        );
      });

      test('start time = 00:03:59', () => {
        const currentState = { beginTime: '00:03:59', endTime: '00:08:00.00' };
        const value = waveformUtils.updateSegment(segment, currentState, peaks);
        expect(value.segments._segments).toHaveLength(3);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 239,
              id: '123a-456b-789c-4d'
            })
          ])
        );
      });

      test('start time = 00:03:59.99', () => {
        const currentState = {
          beginTime: '00:03:59.99',
          endTime: '00:08:00.00'
        };
        const value = waveformUtils.updateSegment(segment, currentState, peaks);
        expect(value.segments._segments).toHaveLength(3);
        expect(value.segments._segments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              startTime: 239.99,
              id: '123a-456b-789c-4d'
            })
          ])
        );
      });
    });

    describe('prevents overlapping with existing segments', () => {
      test('when start time of an editing segment overlaps segment before', () => {
        const testSegment = {
          startTime: 480,
          endTime: 500,
          editable: true,
          id: 'test-segment',
          color: '#FBB040'
        };
        peaks.segments.add(testSegment);
        // Change start time to overlap with previous segment
        testSegment.startTime = 480;
        const value = waveformUtils.preventSegmentOverlapping(
          testSegment,
          peaks
        );
        expect(value).toEqual({
          startTime: 480.01,
          endTime: 500,
          editable: true,
          id: 'test-segment',
          color: '#FBB040'
        });
      });

      test('when end time of an editing segment overlaps segment after', () => {
        const testSegment = {
          startTime: 490.99,
          endTime: 540,
          editable: true,
          id: 'test-segment',
          color: '#FBB040'
        };
        peaks.segments.add(testSegment);
        // Change end time to overlap with following segment
        testSegment.endTime = 543.24;
        const value = waveformUtils.preventSegmentOverlapping(
          testSegment,
          peaks
        );
        expect(value).toEqual({
          startTime: 490.99,
          endTime: 543.23,
          editable: true,
          id: 'test-segment',
          color: '#FBB040'
        });
      });

      test('when a segment does not overlap neighboring segments', () => {
        const testSegment = {
          startTime: 499.99,
          endTime: 529.99,
          editable: true,
          id: 'test-segment',
          color: '#FBB040'
        };
        peaks.segments.add(testSegment);
        // Change end time to overlap with following segment
        testSegment.endTime = 540.99;
        const value = waveformUtils.preventSegmentOverlapping(
          testSegment,
          peaks
        );
        expect(value).toEqual({
          startTime: 499.99,
          endTime: 540.99,
          editable: true,
          id: 'test-segment',
          color: '#FBB040'
        });
      });
    });
  });
});
