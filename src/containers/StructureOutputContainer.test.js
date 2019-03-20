import React from 'react';
import { PureStructureOutputContainer } from './StructureOutputContainer';
import { mount } from 'enzyme';
import mockAxios from 'axios';
import { testMetadataStructure } from '../test/TestStructure';

describe('StructureOutputContainer class', () => {
  let props,
    pureWrapper,
    initForms = {
      editingDisabled: false,
      structureRetrieved: false,
      waveformRetrieved: false
    };
  beforeEach(() => {
    props = {
      smData: [],
      forms: initForms,
      buildSMUI: jest.fn(),
      handleStructureFile: jest.fn(code => {
        if (code === 0) {
          initForms.structureRetrieved = true;
        }
      })
    };
    mockAxios.get.mockImplementationOnce(() => {
      return Promise.resolve({
        data: testMetadataStructure[0]
      });
    });
    pureWrapper = mount(<PureStructureOutputContainer {...props} />);
  });
  test('component mounts without crashing', () => {
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(pureWrapper.instance()).toBeDefined();

    // Re-render component with updated props
    pureWrapper.setProps({
      ...props
    });

    // expect(pureWrapper.find('h3').instance()).toBeDefined();
    expect(
      pureWrapper
        .find('Button')
        .at(0)
        .instance().props.children
    ).toBe('Save Structure');
  });

  test('component renders AlertContainer when error occurs in API call', () => {
    mockAxios.get.mockImplementationOnce(() => {
      return Promise.reject({
        response: {
          status: 404
        }
      });
    });

    const badWrapper = mount(<PureStructureOutputContainer {...props} />);

    // Test for changes in state and AlertContainer asynchronously
    setImmediate(() => {
      expect(badWrapper.instance().state.alertObj).not.toBeNull();
      expect(badWrapper.instance().state.alertObj.alertStyle).toEqual('danger');
      expect(badWrapper.instance().state.alertObj.message).toEqual(
        'Requested masterfile not found'
      );
      const alertContainer = badWrapper.find('AlertContainer').instance();
      expect(alertContainer).toBeDefined();
      expect(alertContainer.props.message).toBe(
        'Requested masterfile not found'
      );
      expect(alertContainer.state.show).toBeTruthy();
    }, 0);
  });
});
