import React, { Component } from "react";
import Peaks from "peaks.js";
import { Button, ButtonToolbar, FormControl, Form } from "react-bootstrap";

import soundMP3 from "../data/TOL_6min_720p_download.mp3";
import soundOGG from "../data/TOL_6min_720p_download.ogg";
import soundJSON from "../data/TOL_6min_720p_download.json";
import soundDAT from "../data/TOL_6min_720p_download.dat";

const peaksOptions = {
  container: null,
  mediaElement: null,
  dataUri: {
    arraybuffer: soundDAT,
    json: soundJSON
  },
  keyboard: true,
  pointMarkerColor: "#006eb0",
  showPlayheadTime: true
};

class Waveform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seekTime: ""
    };

    this.peaksInstance = null;

    // Create refs here
    this.waveformContainer = React.createRef();
    this.mediaPlayer = React.createRef();

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Grab the React `refs` now that the component has mounted
    peaksOptions.container = this.waveformContainer.current;
    peaksOptions.mediaElement = this.mediaPlayer.current;

    // Initialize Peaks
    this.peaksInstance = Peaks.init(peaksOptions);
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
        <audio controls ref={this.mediaPlayer}>
          <source src={soundMP3} type="audio/mp3" />
          <source src={soundOGG} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
        <div className="controls">
          <ButtonToolbar className="waveform-controls">
            <Button onClick={this.zoomIn}>Zoom in</Button>
            <Button onClick={this.zoomOut}>Zoom out</Button>
          </ButtonToolbar>
          <Form className="audio-controls" inline>
            <FormControl
              className="form-control"
              type="text"
              value={this.state.seekTime}
              onChange={this.handleChange}
              placeholder="0"
            />{" "}
            <Button onClick={this.seekTime}>Seek</Button>
          </Form>
        </div>
      </section>
    );
  }
}

export default Waveform;
