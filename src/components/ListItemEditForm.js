import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TimespanInlineForm from './TimespanInlineForm';
import { buildSMUI } from '../actions/sm-data';
import { cloneDeep } from 'lodash';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';

const structuralMetadataUtils = new StructuralMetadataUtils();

class ListItemEditForm extends Component {
  constructor(props) {
    super(props);
    this.type = this.props.item.type;
    this.id = this.props.item.id;
  }

  static propTypes = {
    handleEditFormCancel: PropTypes.func,
    item: PropTypes.object.isRequired
  };

  handleCancelClick = e => {
    this.props.handleEditFormCancel();
  };

  handleSaveClick = (id, payload) => {
    // Clone smData
    let clonedItems = cloneDeep(this.props.smData);

    // Get the item
    let item = structuralMetadataUtils.findItem(id, clonedItems);

    // Update items values
    item.label = payload.timespanTitle;
    item.begin = payload.beginTime;
    item.end = payload.endTime;

    // Send updated smData back to redux
    this.props.buildSMUI(clonedItems);

    // Turn off editing
    this.props.handleEditFormCancel();
  };

  render() {
    const { item } = this.props;

    if (item.type === 'span') {
      return (
        <TimespanInlineForm
          item={item}
          cancelFn={this.handleCancelClick}
          saveFn={this.handleSaveClick}
        />
      );
    }
    return null;
  }
}

const mapStateToProps = state => ({
  smData: state.smData
});

const mapDispathToProps = dispatch => ({
  buildSMUI: json => dispatch(buildSMUI(json))
});

export default connect(
  mapStateToProps,
  mapDispathToProps
)(ListItemEditForm);
