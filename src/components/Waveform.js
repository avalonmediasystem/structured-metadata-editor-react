import React, { Component } from 'react';
import Peaks from 'peaks.js';
import {
  Button,
  ButtonToolbar,
  FormControl,
  FormGroup,
  Form,
  Row,
  Col
} from 'react-bootstrap';
import APIUtils from '../api/Utils';
import * as actions from '../actions/show-forms';
import { connect } from 'react-redux';

import soundMP3 from '../data/TOL_6min_720p_download.mp3';

const apiUtils = new APIUtils();

const peaksOptions = {
  container: null,
  mediaElement: null,
  dataUri: null,
  dataUriDefaultFormat: 'json',
  keyboard: true,
  pointMarkerColor: '#006eb0',
  showPlayheadTime: true
};

class Waveform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seekTime: ''
    };

    this.peaksInstance = null;

    // Create refs here
    this.waveformContainer = React.createRef();
    this.mediaPlayer = React.createRef();

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    // Grab the React `refs` now that the component has mounted
    peaksOptions.container = this.waveformContainer.current;
    peaksOptions.mediaElement = this.mediaPlayer.current;

    await apiUtils
      .getRequest('waveform.json')
      .then(response => {
        // Set the masterfile URL as the URI for the waveform data file
        peaksOptions.dataUri = response.request.responseURL;
        // Initialize Peaks
        this.peaksInstance = Peaks.init(peaksOptions);
      })
      .catch(error => {
        if (error.response !== undefined) {
          this.props.handleResponse(error.response.status);
        } else if (error.request !== undefined) {
          this.props.handleResponse(error.request.status);
        } else {
          this.props.handleResponse(-1);
        }
      });
  }

  zoomIn = () => {
    this.peaksInstance.zoom.zoomIn();
  };

  zoomOut = () => {
    this.peaksInstance.zoom.zoomOut();
  };

  handleChange(event) {
    this.setState({
      seekTime: event.target.value
    });
  }

  seekTime = () => {
    const timeInSeconds = parseFloat(this.state.seekTime);
    if (!Number.isNaN(timeInSeconds)) {
      this.peaksInstance.player.seek(timeInSeconds);
    }
  };

  render() {
    return (
      <section className="waveform-section">
        <div id="waveform-container" ref={this.waveformContainer} />
        <Row>
          <Col xs={12} md={6}>
            <audio controls ref={this.mediaPlayer}>
              <source src={soundMP3} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </Col>
          <Col xs={12} md={6} className="text-right">
            <Form
              inline
              onSubmit={e => {
                this.seekTime(this);
                e.preventDefault();
              }}
            >
              <FormGroup>
                <ButtonToolbar>
                  <Button
                    className="glyphicon glyphicon-zoom-in"
                    onClick={this.zoomIn}
                  />
                  <Button
                    className="glyphicon glyphicon-zoom-out"
                    onClick={this.zoomOut}
                  />
                </ButtonToolbar>
              </FormGroup>{' '}
              <FormControl
                className="form-control"
                type="text"
                value={this.state.seekTime}
                onChange={this.handleChange}
                placeholder="0"
              />{' '}
              <Button onClick={this.seekTime}>Seek</Button>
            </Form>
          </Col>
        </Row>
      </section>
    );
  }
}

export default connect(
  null,
  actions
)(Waveform);
