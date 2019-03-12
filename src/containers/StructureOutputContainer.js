import React, { Component } from 'react';
import { connect } from 'react-redux';
import List from '../components/List';
import { Button, Col, Row } from 'react-bootstrap';
import APIUtils from '../api/Utils';
import AlertContainer from './AlertContainer';
import { configureAlert } from '../services/alert-status';
import uuidv1 from 'uuid/v1';
import { cloneDeep } from 'lodash';
import { buildSMUI } from '../actions/sm-data';

const apiUtils = new APIUtils();

class StructureOutputContainer extends Component {
  state = {
    alertObj: {}
  };

  async componentDidMount() {
    try {
      const response = await apiUtils.getRequest('structure.json');

      // Add unique ids to every object
      let smData = this.addIds([response.data]);

      // Update the redux store
      this.props.buildSMUI(smData);
    } catch (error) {
      console.log('TCL: StructureOutputContainer -> }catch -> error', error);
      this.handleFetchError(error);
    }
  }

  /**
   * This function adds a unique, front-end only id, to every object in the data structure
   * @param {Array} structureJS
   * @returns {Array}
   */
  addIds(structureJS) {
    let structureWithIds = cloneDeep(structureJS);

    // Recursively loop through data structure
    let fn = items => {
      for (let item of items) {
        // Create and add an id
        item.id = uuidv1();

        // Send child items back into the function
        if (item.items && item.items.length > 0) {
          fn(item.items);
        }
      }
    };

    fn(structureWithIds);

    return structureWithIds;
  }

  handleFetchError(error) {
    let status = error.response !== undefined ? error.response.status : -2;
    const alertObj = configureAlert(status);

    this.setState({ alertObj });
  }

  handleSaveError(error) {
    console.log('TCL: handleSaveError -> error', error);
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
        this.handleSaveError(error);
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

const mapDispatchToProps = dispatch => ({
  buildSMUI: smData => dispatch(buildSMUI(smData))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StructureOutputContainer);
