import React from 'react';
import Waveform, { PureWaveform } from '../components/Waveform';
import { shallow, mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import Peaks from 'peaks';

const mockStore = configureMockStore([thunk]);

describe('WaveformDataUtils class', () => {
  let store, peaks;
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
    peaks = Peaks.init(options);
    store = mockStore({
      peaksInstance: peaks
    });
  });
  test('renders waveform container without crashing', () => {
    const waveformContainer = React.createRef();
    const mediaPlayer = React.createRef();
    const wrapper = shallow(
      <Provider store={store}>
        <Waveform ref={waveformContainer} ref={mediaPlayer} />
      </Provider>
    );
    expect(wrapper.find('#waveform-container')).toBeDefined();
    expect(wrapper.find('audio')).toBeDefined();
  });

  describe('tests Waveform component view', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = mount(
        <Provider store={store}>
          <Waveform waveformRef={() => {}} mediaPlayerRef={() => {}} />
        </Provider>
      );
    });
    test('renders audio element with src attribute', () => {
      expect(wrapper.find('audio').instance().src).toBe(
        'http://localhost/utah_phillips_one.mp3'
      );
    });
    test('renders props correctly', () => {
      expect(
        wrapper.find(Waveform).instance().props.mediaPlayerRef
      ).toBeDefined();
      expect(wrapper.find(Waveform).instance().props.waveformRef).toBeDefined();
    });
    test('renders waveform control buttons', () => {
      expect(
        wrapper
          .find('Button')
          .at(0)
          .instance().props.className
      ).toBe('glyphicon glyphicon-zoom-in');
      expect(
        wrapper
          .find('Button')
          .at(1)
          .instance().props.className
      ).toBe('glyphicon glyphicon-zoom-out');
    });
  });

  test('tests zoom in button click', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Waveform waveformRef={() => {}} mediaPlayerRef={() => {}} />
      </Provider>
    );
    const zoomInBtn = wrapper.find('Button').at(0);

    expect(
      wrapper.instance().props.store.getState().peaksInstance.zoom
        ._zoomLevelIndex
    ).toEqual(2);

    zoomInBtn.simulate('click');

    expect(
      wrapper.instance().props.store.getState().peaksInstance.zoom
        ._zoomLevelIndex
    ).toEqual(1);

    expect(
      wrapper.instance().props.store.getState().peaksInstance.zoom.zoomIn
    ).toHaveBeenCalledTimes(1);
  });
  test('tests zoom out button click', () => {
    const wrapper = mount(
      <Provider store={store}>
        <Waveform waveformRef={() => {}} mediaPlayerRef={() => {}} />
      </Provider>
    );
    const zoomOutBtn = wrapper.find('Button').at(1);
    expect(
      wrapper.instance().props.store.getState().peaksInstance.zoom
        ._zoomLevelIndex
    ).toEqual(2);
    zoomOutBtn.simulate('click');
    expect(
      wrapper.instance().props.store.getState().peaksInstance.zoom
        ._zoomLevelIndex
    ).toEqual(3);
    expect(
      wrapper.instance().props.store.getState().peaksInstance.zoom.zoomOut
    ).toHaveBeenCalledTimes(1);
  });
  test('tests input form for change event', () => {
    const wrapper = mount(
      <PureWaveform
        waveformRef={() => {}}
        mediaPlayerRef={() => {}}
        peaksInstance={peaks}
      />
    );
    expect(wrapper.find('FormControl').instance().props.value).toEqual('');
    // Mock user input through form
    wrapper.find('FormControl').simulate('change', { target: { value: '36' } });
    expect(wrapper.find('FormControl').instance().props.value).toEqual('36');
  });
  test('tests seek time button click', () => {
    const wrapper = mount(
      <PureWaveform
        waveformRef={() => {}}
        mediaPlayerRef={() => {}}
        peaksInstance={peaks}
      />
    );
    // Update state
    wrapper.setState({ seekTime: '36' });
    expect(
      wrapper.instance().props.peaksInstance.player._mediaElement.currentTime
    ).toEqual(0);
    wrapper
      .find('Button')
      .at(2)
      .simulate('click');
    expect(
      wrapper.instance().props.peaksInstance.player._mediaElement.currentTime
    ).toEqual(36);
  });
});
