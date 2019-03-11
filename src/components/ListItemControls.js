import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

const tooltip = tip => <Tooltip id="tooltip">{tip}</Tooltip>;

const ListItemControls = props => {
  const {
    itemType,
    handleShowDropTargetsClick,
    handleEditClick,
    handleDelete,
    showForms
  } = props;

  return (
    <div className="edit-controls-wrapper">
      {itemType === 'span' && (
        <OverlayTrigger placement="left" overlay={tooltip('Show drop targets')}>
          <Button
            bsStyle="link"
            disabled={showForms.disabled}
            onClick={handleShowDropTargetsClick}
          >
            <FontAwesomeIcon icon="dot-circle" />
          </Button>
        </OverlayTrigger>
      )}
      <OverlayTrigger placement="top" overlay={tooltip('Edit')}>
        <Button
          bsStyle="link"
          onClick={handleEditClick}
          disabled={showForms.disabled}
        >
          <FontAwesomeIcon icon="pen" />
        </Button>
      </OverlayTrigger>
      {itemType !== 'root' && (
        <OverlayTrigger placement="right" overlay={tooltip('Delete')}>
          <Button
            bsStyle="link"
            onClick={handleDelete}
            disabled={showForms.disabled}
          >
            <FontAwesomeIcon icon="trash" />
          </Button>
        </OverlayTrigger>
      )}
    </div>
  );
};

ListItemControls.propTypes = {
  handleShowDropTargetsClick: PropTypes.func,
  handleEditClick: PropTypes.func,
  handleDelete: PropTypes.func,
  itemType: PropTypes.string
};

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(mapStateToProps)(ListItemControls);
