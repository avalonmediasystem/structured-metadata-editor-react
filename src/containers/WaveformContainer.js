import React, { Component } from 'react';
import APIUtils from '../api/Utils';
import { connect } from 'react-redux';
import * as peaksActions from '../actions/peaks-instance';
import * as showFormActions from '../actions/show-forms';
import Waveform from '../components/Waveform';
import WaveformErrorBoundary from '../components/WaveformErrorBoundary';

const apiUtils = new APIUtils();

// Peaks options
const peaksOptions = {
  container: null,
  mediaElement: null,
  dataUri: null,
  dataUriDefaultFormat: 'json',
  keyboard: true,
  pointMarkerColor: '#006eb0',
  showPlayheadTime: true,
  zoomWaveformColor: 'rgba(217, 217, 217, 1)'
};

class WaveformContainer extends Component {
  constructor(props) {
    super(props);
    this.waveformContainer = null;
    this.mediaPlayer = null;
    this.peaksInstance = null;
  }

  componentDidMount() {
    peaksOptions.container = this.waveformContainer;
    peaksOptions.mediaElement = this.mediaPlayer;
    this.initializePeaks();
  }

  async initializePeaks() {
    try {
      const response = await apiUtils.getRequest('waveform.json');
      // Set the masterfile URL as the URI for the waveform data file
      peaksOptions.dataUri = response.request.responseURL;
      // Initialize Peaks
      this.props.initPeaks(this.props.smData, peaksOptions);
    } catch (error) {
      if (error.response !== undefined) {
        this.props.handleResponse(error.response.status);
      } else if (error.request !== undefined) {
        this.props.handleResponse(error.request.status);
      } else {
        this.props.handleResponse(-1);
      }
    }
  }

  render() {
    return (
      <section className="waveform-section">
        <WaveformErrorBoundary>
          <Waveform
            waveformRef={ref => (this.waveformContainer = ref)}
            mediaPlayerRef={ref => (this.mediaPlayer = ref)}
          />
        </WaveformErrorBoundary>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  smData: state.smData
});

const mapDispatchToProps = dispatch => ({
  initPeaks: (smData, options) =>
    dispatch(peaksActions.initPeaks(smData, options)),
  handleResponse: status => dispatch(showFormActions.handleResponse(status))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WaveformContainer);