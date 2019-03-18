import React from 'react';
import StructureOutputContainer from './StructureOutputContainer';
import { mount } from 'enzyme';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import mockAxios from 'axios';
import { testMetadataStructure } from '../test/TestStructure';

const mockStore = configureStore([thunk]);

describe('StructureOutputContainer component', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      smData: [],
      buildSMUI: jest.fn()
    });
    mockAxios.get.mockImplementationOnce(() => {
      return Promise.resolve({
        data: testMetadataStructure[0]
      });
    });
  });
  test('component mounts without crashing', () => {
    const wrapper = mount(
      <Provider store={store}>
        <StructureOutputContainer />
      </Provider>
    );
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(wrapper.find('h3').instance()).toBeDefined();
    expect(wrapper.find('Button').instance().props.children).toBe(
      'Save Structure'
    );
  });
});
