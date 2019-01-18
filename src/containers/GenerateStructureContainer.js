import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/sm-data';
import APIUtils from '../api/Utils';
import * as showFormActions from '../actions/show-forms';

const apiUtils = new APIUtils();

class GenerateStructureContainer extends Component {
  constructor(props) {
    super(props);
    this.smData = [];
  }

  async componentDidMount() {
    await apiUtils
      .getRequest('structure.json')
      .then(response => {
        const structureJS = response.data;
        this.smData = [structureJS];
        this.props.buildSMUI(this.smData);
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
