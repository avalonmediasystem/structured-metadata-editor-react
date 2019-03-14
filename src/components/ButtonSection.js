import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Collapse, Row } from 'react-bootstrap';
import HeadingFormContainer from '../containers/HeadingFormContainer';
import TimespanFormContainer from '../containers/TimespanFormContainer';
import * as peaksActions from '../actions/peaks-instance';
import { configureAlert } from '../services/alert-status';
import AlertContainer from '../containers/AlertContainer';

const styles = {
  section: {
    margin: '4rem 0'
  },
  well: {
    marginTop: '1rem'
  }
};

class ButtonSection extends Component {
  state = {
    headingOpen: false,
    timespanOpen: false,
    initSegment: null,
    isInitializing: true,
    alertObj: null
  };

  updateInitializeFlag = value => {
    this.setState({
      isInitializing: value
    });
  };

  clearAlert = () => {
    this.setState({
      alertObj: null
    });
  };

  handleCancelHeadingClick = () => {
    this.setState({ headingOpen: false });
    this.clearAlert();
  };

  handleCancelTimespanClick = () => {
    if (this.state.initSegment !== null) {
      this.props.deleteTempSegment(this.state.initSegment.id);
    }
    this.setState({ timespanOpen: false });
    this.clearAlert();
  };

  handleHeadingClick = () => {
    if (this.state.initSegment !== null) {
      this.props.deleteTempSegment(this.state.initSegment.id);
    }
    this.setState({
      alertObj: null,
      headingOpen: true,
      timespanOpen: false
    });
  };

  handleTimeSpanClick = () => {
    this.props.createTempSegment();
    const tempSegment = this.props.peaksInstance.peaks.segments.getSegment(
      'temp-segment'
    );
    if (tempSegment === null) {
      this.setState({
        alertObj: configureAlert(-4, this.clearAlert),
        headingOpen: false
      });
    } else {
      this.setState({
        initSegment: tempSegment,
        headingOpen: false,
        timespanOpen: true,
        isInitializing: true
      });
    }
  };

  render() {
    const timespanFormProps = {
      cancelClick: this.handleCancelTimespanClick,
      initSegment: this.state.initSegment,
      isInitializing: this.state.isInitializing,
      timespanOpen: this.state.timespanOpen,
      updateInitialize: this.updateInitializeFlag
    };
    return (
      <section style={styles.section}>
        <AlertContainer {...this.state.alertObj} />
        <Row>
          <Col xs={6}>
            <Button block onClick={this.handleHeadingClick}>
              Add a Heading
            </Button>
          </Col>
          <Col xs={6}>
            <Button block onClick={this.handleTimeSpanClick}>
              Add a Timespan
            </Button>
          </Col>
        </Row>

        <Collapse in={this.state.headingOpen}>
          <div className="well" style={styles.well}>
            <HeadingFormContainer cancelClick={this.handleCancelHeadingClick} />
          </div>
        </Collapse>
        <Collapse in={this.state.timespanOpen}>
          <div className="well" style={styles.well}>
            <TimespanFormContainer {...timespanFormProps} />
          </div>
        </Collapse>
      </section>
    );
  }
}

// To use in tests as a disconnected component (to access state)
export { ButtonSection as PureButtonSection };

const mapStateToProps = state => ({
  smData: state.smData,
  peaksInstance: state.peaksInstance
});

const mapDispatchToProps = {
  createTempSegment: peaksActions.insertTempSegment,
  deleteTempSegment: peaksActions.deleteTempSegment
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonSection);
