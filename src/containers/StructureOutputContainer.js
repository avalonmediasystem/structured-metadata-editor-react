import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../components/List';
import GenerateStructureContainer from './GenerateStructureContainer';
import { Button, Col, Row } from 'react-bootstrap';
import APIUtils from '../api/Utils';
import AlertContainer from './AlertContainer';
import { configureAlert } from '../services/alert-status';

const apiUtils = new APIUtils();

class StructureOutputContainer extends Component {
  state = {
    alertObj: {}
  };

  handleError(error) {
    let status =
      error.response !== undefined
        ? error.response.status
        : error.request.status;
    const alertObj = configureAlert(status);

    this.setState({ alertObj });
  }

  handleSaveItClick = () => {
    let postData = { json: this.props.smData[0] };
    apiUtils
      .postRequest('structure.json', postData)
      .then(response => {
        const { status } = response;
        const alertObj = configureAlert(status);

        this.setState({ alertObj, showAlert: true });
      })
      .catch(error => {
        this.handleError(error);
      });
  };

  render() {
    const { smData = [] } = this.props;
    const { alertObj } = this.state;

    return (
      <section>
        <h3>HTML Structure Tree from a masterfile in server</h3>
        <AlertContainer {...alertObj} />
        <br />
        <GenerateStructureContainer />
        <List items={smData} />
        <Row>
          <Col xs={12} className="text-right">
            <Button bsStyle="primary" onClick={this.handleSaveItClick}>
              Save Structure
            </Button>
          </Col>
        </Row>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  smData: state.smData
});

export default connect(mapStateToProps)(StructureOutputContainer);
