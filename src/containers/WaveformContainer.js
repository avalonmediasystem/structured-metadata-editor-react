import React, { Component } from 'react';
import APIUtils from '../api/Utils';
import { connect } from 'react-redux';
import * as peaksActions from '../actions/peaks-instance';
import * as actions from '../actions/show-forms';
import Waveform from '../components/Waveform';
import WaveformErrorBoundary from '../components/WaveformErrorBoundary';
import AlertContainer from '../containers/AlertContainer';
import { configureAlert } from '../services/alert-status';

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
  }

  state = {
    alertObj: null
  };

  componentDidMount() {
    peaksOptions.container = this.waveformContainer;
    peaksOptions.mediaElement = this.mediaPlayer;
    this.initializePeaks();
  }

  handleError(error) {
    console.log('TCL: WaveformContainer -> handleError -> error', error);
    let status = null;

    // Pull status code out of error response/request
    if (error.response !== undefined) {
      status = error.response.status;
    } else if (error.request !== undefined) {
      status = error.request.status;
    } else {
      status = -1;
    }

    const alertObj = configureAlert(status);
    this.setState({ alertObj, error: true });
  }

  async initializePeaks() {
    try {
      const response = await apiUtils.getRequest('waveform.json');
      // Set the masterfile URL as the URI for the waveform data file
      peaksOptions.dataUri = response.request.responseURL;
      // Initialize Peaks
      this.props.initPeaks(this.props.smData, peaksOptions);
    } catch (error) {
      this.handleError(error);
    }
  }

  render() {
    const { alertObj } = this.state;

    return (
      <section className="waveform-section">
        <WaveformErrorBoundary>
          <Waveform
            waveformRef={ref => (this.waveformContainer = ref)}
            mediaPlayerRef={ref => (this.mediaPlayer = ref)}
          />
        </WaveformErrorBoundary>

        {alertObj && (
          <AlertContainer
            message={alertObj.message}
            alertStyle={alertObj.alertStyle}
          />
        )}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  smData: state.smData
});

const mapDispatchToProps = dispatch => ({
  ...actions,
  initPeaks: (smData, options) =>
    dispatch(peaksActions.initPeaksInstance(smData, options))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WaveformContainer);
