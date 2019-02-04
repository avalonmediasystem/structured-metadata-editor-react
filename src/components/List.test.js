import React from 'react';
import List from './List';
import { shallow } from 'enzyme';
import { testMetadataStructure } from '../test/TestStructure';

describe('List component', () => {
  test('renders without crashing when metadata is not empty', () => {
    const items = [...testMetadataStructure];
    const wrapper = shallow(<List items={items} />);
    expect(wrapper.find('.structure-list')).toBeDefined();
    expect(wrapper.find('ListItemEditForm')).toBeDefined();
  });
  test('renders without crashing when metadata is empty', () => {
    const items = [];
    const wrapper = shallow(<List items={items} />);
    expect(wrapper.find('.structure-list')).toBeDefined();
  });
});
