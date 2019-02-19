import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../components/List';
import GenerateStructureContainer from './GenerateStructureContainer';
import { Button, Col, Row } from 'react-bootstrap';
import * as actions from '../actions/show-forms';
import APIUtils from '../api/Utils';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

const apiUtils = new APIUtils();

class StructureOutputContainer extends Component {
  handleSaveItClick = () => {
    let postData = { json: this.props.smData[0] };
    apiUtils
      .postRequest('structure.json', postData)
      .then(response => {
        this.props.handleResponse(response.status, response.statusText);
      })
      .catch(error => {
        if (error.response !== undefined) {
          this.props.handleResponse(error.response.status);
        } else {
          this.props.handleResponse(error.request.status);
        }
      });
  };

  render() {
    const { smData = [] } = this.props;
    const { showForms } = this.props;
    return (
      <section>
        <h3>HTML Structure Tree from a masterfile in server</h3>
        <br />
        <GenerateStructureContainer />
        <BlockUi blocking={showForms.blocking}>
          <List items={smData} />
        </BlockUi>
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
  smData: state.smData,
  showForms: state.showForms
});

export default connect(
  mapStateToProps,
  actions
)(StructureOutputContainer);
