import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TimespanInlineForm from './TimespanInlineForm';
import { buildSMUI } from '../actions/sm-data';

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
    // Save the data to store
    console.log('fires save action');
    console.log('TCL: ListItemEditForm -> handleSaveClick -> payload', payload);
    console.log('TCL: ListItemEditForm -> handleSaveClick -> id', id);
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

const mapDispathToProps = dispatch => ({
  buildSMUI: json => dispatch(buildSMUI(json))
});

export default connect(
  null,
  mapDispathToProps
)(ListItemEditForm);
