import React from 'react';
import WaveformDataUtils from './WaveformDataUtils';
import Waveform from '../components/Waveform';
import mockAxios from 'axios';
import { mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import APIUtils from '../api/Utils';

const apiUtils = new APIUtils();
const waveformUtils = new WaveformDataUtils();
const mockStore = configureMockStore([thunk]);
const dataURI = '';

describe('WaveformDataUtils class', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      peaksInstance: {}
    });
  });

  test('initializes peaks', () => {
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
    const waveformRef = wrapper.find('#waveform-container').instance();
    const audioRef = wrapper.find('audio').instance();
    const options = {
      container: waveformRef,
      mediaElement: audioRef,
      dataUri: null,
      dataUriDefaultFormat: 'json',
      keyboard: true,
      pointMarkerColor: '#006eb0',
      showPlayheadTime: true,
      zoomWaveformColor: 'rgba(217, 217, 217, 1)'
    };
    // console.log(wrapper.find('#waveform-container').instance());
    // const value = waveformUtils.initPeaks([], options);
  });
});
