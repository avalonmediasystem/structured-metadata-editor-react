import React from 'react';
import { PureStructureOutputContainer } from './StructureOutputContainer';
import { mount } from 'enzyme';
import mockAxios from 'axios';
import { testMetadataStructure } from '../test/TestStructure';

describe('StructureOutputContainer class', () => {
  let props, initForms;
  beforeEach(() => {
    initForms = {
      editingDisabled: false,
      structureRetrieved: false,
      waveformRetrieved: false
    };
    props = {
      smData: [],
      forms: initForms,
      buildSMUI: jest.fn(),
      retrieveStructureSuccess: jest.fn(() => {
        initForms.structureRetrieved = true;
      })
    };
  });

  test('component mounts without crashing', () => {
    mockAxios.get.mockImplementationOnce(() => {
      return Promise.resolve({
        data: testMetadataStructure[0]
      });
    });
    const pureWrapper = mount(<PureStructureOutputContainer {...props} />);

    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(pureWrapper.instance()).toBeDefined();

    // Test for changes in state asynchronously
    setImmediate(() => {
      expect(
        pureWrapper.instance().props.forms.structureRetrieved
      ).toBeTruthy();
      expect(pureWrapper.instance().state.alertObj).toEqual({});
      expect(pureWrapper.instance().state.alertObj).toEqual({});
    }, 0);
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

    // Accumulated from previous GET request
    expect(mockAxios.get).toHaveBeenCalledTimes(2);

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
