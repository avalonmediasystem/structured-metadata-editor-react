import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/sm-data';
import APIUtils from '../api/Utils';
import * as showFormActions from '../actions/show-forms';
import uuidv1 from 'uuid/v1';
import { cloneDeep } from 'lodash';

const apiUtils = new APIUtils();

class GenerateStructureContainer extends Component {
  async componentDidMount() {
    try {
      const response = await apiUtils.getRequest('structure.json');
      let structureJS = response.data;

      // Add unique ids to every object
      let smData = this.addIds([structureJS]);

      // Update the redux store
      this.props.buildSMUI(smData);
    } catch (error) {
      if (error.response !== undefined) {
        this.props.handleResponse(error.response.status);
      } else if (error.request !== undefined) {
        this.props.handleResponse(error.request.status);
      } else {
        this.props.handleResponse(-1);
      }
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

  render() {
    return null;
  }
}

const mapDispatchToProps = dispatch => ({
  buildSMUI: smData => dispatch(actions.buildSMUI(smData)),
  handleResponse: statusCode =>
    dispatch(showFormActions.handleResponse(statusCode))
});

export default connect(
  null,
  mapDispatchToProps
)(GenerateStructureContainer);
