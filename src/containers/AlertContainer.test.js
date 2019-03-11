import React from 'react';
import { shallow } from 'enzyme';
import AlertContainer from './AlertContainer';

const props = {
  message: 'Ima test message',
  alertStyle: 'warning'
};

describe('AlertContainer', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<AlertContainer {...props} />);
    expect(wrapper.find('Alert')).toHaveLength(1);
  });

  it('closes when state updates to not display the alert message', () => {
    const wrapper = shallow(<AlertContainer {...props} />);
    wrapper.setState({ show: false });
    expect(wrapper.find('Alert')).toHaveLength(0);
  });
});
