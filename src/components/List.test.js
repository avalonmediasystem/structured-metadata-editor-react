import React from 'react';
import List from './List';
import { shallow } from 'enzyme';
import { testMetadataStructure } from '../test/TestStructure';

describe('List tests', () => {
  test('renders without crashing', () => {
    const items = [...testMetadataStructure];
    const wrapper = shallow(<List items={items} />);
    expect(wrapper.find('.structure-list')).toBeDefined();
  });
});
