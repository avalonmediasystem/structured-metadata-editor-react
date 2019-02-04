import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const tooltip = tip => <Tooltip id="tooltip">{tip}</Tooltip>;

const ListItemControls = props => {
  return (
    <div className="edit-controls-wrapper">
      {props.itemType === 'span' && (
        <OverlayTrigger placement="left" overlay={tooltip('Show drop targets')}>
          <Button bsStyle="link">
            <FontAwesomeIcon
              icon="dot-circle"
              onClick={props.handleShowDropTargetsClick}
            />
          </Button>
        </OverlayTrigger>
      )}
      <OverlayTrigger placement="top" overlay={tooltip('Edit')}>
        <Button bsStyle="link">
          <FontAwesomeIcon icon="pen" onClick={props.handleEditClick} />
        </Button>
      </OverlayTrigger>
      <OverlayTrigger placement="right" overlay={tooltip('Delete')}>
        <Button bsStyle="link">
          <FontAwesomeIcon icon="trash" onClick={props.handleDelete} />
        </Button>
      </OverlayTrigger>
    </div>
  );
};

ListItemControls.propTypes = {
  handleShowDropTargetsClick: PropTypes.func,
  handleEditClick: PropTypes.func,
  handleDelete: PropTypes.func,
  itemType: PropTypes.string
};

export default ListItemControls;
