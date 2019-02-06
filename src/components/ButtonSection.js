import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Collapse, Row } from 'react-bootstrap';
import AlertContainer from '../containers/AlertContainer';
import HeadingFormContainer from '../containers/HeadingFormContainer';
import TimespanFormContainer from '../containers/TimespanFormContainer';

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
    timespanOpen: false
  };

  handleCancelHeadingClick = () => {
    this.setState({ headingOpen: false });
  };

  handleCancelTimespanClick = () => {
    this.setState({ timespanOpen: false });
  };

  handleHeadingClick = () => {
    this.setState({
      headingOpen: true,
      timespanOpen: false
    });
  };

  handleTimeSpanClick = () => {
    this.setState({ headingOpen: false, timespanOpen: true });
  };

  render() {
    return (
      <section style={styles.section}>
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
            <HeadingFormContainer
              cancelClick={this.handleCancelHeadingClick}
            />
          </div>
        </Collapse>
        <Collapse in={this.state.timespanOpen}>
          <div className="well" style={styles.well}>
            <TimespanFormContainer
              cancelClick={this.handleCancelTimespanClick}
            />
          </div>
        </Collapse>
        <AlertContainer />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  smData: state.smData
});

export default connect(mapStateToProps)(ButtonSection);
