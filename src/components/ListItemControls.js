import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  OverlayTrigger,
  Popover,
  Tooltip
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { handleEditingTimespans } from '../actions/show-forms';

const styles = {
  buttonToolbar: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
};

const tooltip = tip => <Tooltip id="tooltip">{tip}</Tooltip>;

// const popoverTop = message => (
//   <Popover id="popover-positioned-top" title="Popover top">
//     <strong>Holy guacamole!</strong> Check this info.
//   </Popover>
// );

class ListItemControls extends Component {
  static propTypes = {
    handleShowDropTargetsClick: PropTypes.func,
    handleEditClick: PropTypes.func,
    handleDelete: PropTypes.func,
    item: PropTypes.shape({
      childrenCount: PropTypes.number,
      label: PropTypes.string.isRequired,
      type: PropTypes.string
    })
  };

  state = {
    deleteMessage: '',
    showDeleteConfirm: false
  };

  handleConfirmDelete = () => {
    this.props.handleDelete();
    this.setState({ deleteMessage: '', showDeleteConfirm: false });
  };

  handleDeleteClick = e => {
    const { childrenCount, label } = this.props.item;
    let deleteMessage = `Are you sure you'd like to delete "${label}"`;

    // Disable editing of other list items
    this.props.handleEditingTimespans(0);

    if (childrenCount > 0) {
      deleteMessage += ` and it's ${childrenCount} child items`;
    }
    deleteMessage += `?`;

    this.setState({
      deleteMessage,
      showDeleteConfirm: true
    });
  };

  cancelDeleteClick = e => {
    // Enable editing of other list items
    this.props.handleEditingTimespans(1);

    this.setState({
      showDeleteConfirm: false
    });
  };

  render() {
    const {
      handleShowDropTargetsClick,
      handleEditClick,
      item,
      showForms
    } = this.props;
    const { deleteMessage, showDeleteConfirm } = this.state;

    return (
      <div className="edit-controls-wrapper">
        {item.type === 'span' && (
          <Button
            bsStyle="link"
            disabled={showForms.disabled}
            onClick={handleShowDropTargetsClick}
          >
            <FontAwesomeIcon icon="dot-circle" />
          </Button>
        )}
        <Button
          bsStyle="link"
          onClick={handleEditClick}
          disabled={showForms.disabled}
        >
          <FontAwesomeIcon icon="pen" />
        </Button>

        {item.type !== 'root' && (
          <Button
            bsStyle="link"
            onClick={this.handleDeleteClick}
            disabled={showForms.disabled}
          >
            <FontAwesomeIcon icon="trash" />
          </Button>
        )}
        {showDeleteConfirm && (
          <Popover
            id="delete-confirm-popover"
            title="Confirm delete?"
            placement="top"
            positionTop={-120}
            positionLeft={-70}
            style={{ height: 'auto', width: 250 }}
          >
            <p>{deleteMessage}</p>
            <ButtonToolbar style={styles.buttonToolbar}>
              <Button
                bsStyle="danger"
                bsSize="xsmall"
                onClick={this.handleConfirmDelete}
              >
                Delete
              </Button>
              <Button bsSize="xsmall" onClick={this.cancelDeleteClick}>
                Cancel
              </Button>
            </ButtonToolbar>
          </Popover>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  handleEditingTimespans: code => dispatch(handleEditingTimespans(code))
});

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListItemControls);
