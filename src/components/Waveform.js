import React, { Component } from "react";
import Peaks from "peaks.js";
import { Button, ButtonToolbar, FormControl, Form } from "react-bootstrap";

import soundMP3 from "../data/TOL_6min_720p_download.mp3";
import soundOGG from "../data/TOL_6min_720p_download.ogg";
import soundJSON from "../data/TOL_6min_720p_download.json";
import soundDAT from "../data/TOL_6min_720p_download.dat";

class Waveform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peaksInstance: null,
      seekTime: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const options = {
      container: this.refs.waveformContainer,
      mediaElement: this.refs.mediaPlayer,
      dataUri: {
        arraybuffer: soundDAT,
        json: soundJSON
      },
      keyboard: true,
      pointMarkerColor: "#006eb0",
      showPlayheadTime: true
    };

    this.setState({
      peaksInstance: Peaks.init(options)
    });
  }

  zoomIn = () => {
    this.state.peaksInstance.zoom.zoomIn();
  };

  zoomOut = () => {
    this.state.peaksInstance.zoom.zoomOut();
  };

  handleChange(event) {
    this.setState({
      seekTime: event.target.value
    });
  }

  seekTime = () => {
    const timeInSeconds = parseFloat(this.state.seekTime);
    if (!Number.isNaN(timeInSeconds)) {
      this.state.peaksInstance.player.seek(timeInSeconds);
    }
  };

  render() {
    return (
      <section className="waveform-section">
        <div id="waveform-container" ref="waveformContainer" />
        <audio controls ref="mediaPlayer">
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
