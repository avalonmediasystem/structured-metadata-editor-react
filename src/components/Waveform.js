import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  FormControl,
  FormGroup,
  Form,
  Row,
  Col
} from 'react-bootstrap';
import soundMP3 from '../data/utah_phillips_one.mp3';
import { connect } from 'react-redux';

class Waveform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seekTime: ''
    };

    // Create `refs`
    this.waveformContainer = React.createRef();
    this.mediaPlayer = React.createRef();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Grab the React `refs` now the component is mounted
    this.props.waveformRef(this.waveformContainer.current);
    this.props.mediaPlayerRef(this.mediaPlayer.current);
  }

  zoomIn = () => {
    this.props.peaksInstance.zoom.zoomIn();
  };

  zoomOut = () => {
    this.props.peaksInstance.zoom.zoomOut();
  };

  handleSubmit(event) {
    this.seekTime();
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({
      seekTime: event.target.value
    });
  }

  seekTime = () => {
    const timeInSeconds = parseFloat(this.state.seekTime);
    if (!Number.isNaN(timeInSeconds)) {
      this.props.peaksInstance.player.seek(timeInSeconds);
    }
  };

  render() {
    return (
      <div>
        <div id="waveform-container" ref={this.waveformContainer} />
        <Row>
          <Col xs={12} md={6}>
            <audio controls ref={this.mediaPlayer}>
              <source src={soundMP3} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </Col>
          <Col xs={12} md={6} className="text-right">
            <Form inline onSubmit={this.handleSubmit}>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  peaksInstance: state.peaksInstance
});

export default connect(mapStateToProps)(Waveform);
