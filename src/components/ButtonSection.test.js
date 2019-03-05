import React from 'react';
import { PureButtonSection } from './ButtonSection';
import { shallow } from 'enzyme';
import { testMetadataStructure } from '../test/TestStructure';
import Peaks from 'peaks';

describe('ButtonSection component', () => {
  let wrapper, props;
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
    const peaks = { peaks: Peaks.init(options) };
    let props = {
      peaksInstance: peaks,
      smData: testMetadataStructure,
      createTempSegment: jest.fn(() => {
        peaks.peaks.segments.add({
          id: 'temp-segment',
          startTime: 180,
          endTime: 240,
          editable: true,
          color: '#FBB040'
        });
      })
    };
    wrapper = shallow(<PureButtonSection {...props} />);
  });

  test('component renders wiithout crashing', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.headingOpen).toBeFalsy();
    expect(wrapper.instance().state.timespanOpen).toBeFalsy();
    expect(wrapper.instance().state.isInitializing).toBeTruthy();
    expect(wrapper.instance().state.initSegment).toBeNull();
    expect(wrapper.find('Button').at(0)).toBeDefined();
  });

  test('tests Add Heading', () => {
    const addheading = wrapper.find('Button').at(0);
    addheading.simulate('click');
    expect(wrapper.instance().state.headingOpen).toBeTruthy();
    expect(wrapper.instance().state.timespanOpen).toBeFalsy();
  });

  test('tests Add Timespan', () => {
    const addSpan = wrapper.find('Button').at(1);
    addSpan.simulate('click');
    expect(wrapper.instance().props.createTempSegment).toHaveBeenCalled();
    expect(wrapper.instance().state.timespanOpen).toBeTruthy();
    expect(wrapper.instance().state.headingOpen).toBeFalsy();
    expect(wrapper.instance().state.initSegment).toEqual({
      id: 'temp-segment',
      startTime: 180,
      endTime: 240,
      editable: true,
      color: '#FBB040'
    });
  });
});
