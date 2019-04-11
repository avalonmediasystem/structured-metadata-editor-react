import React from 'react';
import ListItem from './ListItem';
import { shallow } from 'enzyme';

describe('ListItem component (test independent from React DnD)', () => {
  let component;

  // Reference for this solution: https://github.com/react-dnd/react-dnd/issues/925
  const getComponent = (item = {}) => {
    // Obtain the reference to the component before React DnD wrapping
    let OriginalComponent = ListItem.DecoratedComponent;
    // Stub the React DnD connector functions with an identity function
    let identity = el => el;

    if (!component) {
      component = shallow(
        <OriginalComponent
          item={item}
          key={item.id}
          connectDragSource={identity}
          connectDropTarget={identity}
        />
      );
      return component;
    }
  };

  beforeEach(() => {
    component = undefined;
  });

  test('renders ListItem without crashing without a metadata item', () => {
    const wrapper = getComponent({});
    expect(wrapper.instance().props.item).toEqual({});
  });
  test('renders ListItem without crashing with a metadata item', () => {
    const item = {
      type: 'span',
      label: 'Segment 1.1',
      id: '123a-456b-789c-3d',
      begin: '00:00:03.32',
      end: '00:00:10.32'
    };
    const wrapper = getComponent(item);
    expect(wrapper.instance().props.item).toEqual(item);
  });
});
