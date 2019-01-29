import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const styles = {
  formControl: {
    margin: '0 5px'
  }
};

const tooltip = tip => <Tooltip id="tooltip">{tip}</Tooltip>;

class ListItemEditForm extends Component {
  static propTypes = {
    handleEditFormCancel: PropTypes.func,
    item: PropTypes.object.isRequired
  };

  handleCancelClick = e => {
    this.props.handleEditFormCancel();
  };

  render() {
    return (
      <Form inline>
        <div className="row-wrapper">
          <div>
            <FormGroup controlId="formInlineTitle">
              <ControlLabel>Title</ControlLabel>
              <FormControl type="text" style={styles.formControl} />
            </FormGroup>
            <FormGroup controlId="formInlineBegin">
              <ControlLabel>Begin Time</ControlLabel>
              <FormControl type="text" style={styles.formControl} />
            </FormGroup>
            <FormGroup controlId="formInlineEnd">
              <ControlLabel>End Time</ControlLabel>
              <FormControl type="text" style={styles.formControl} />
            </FormGroup>
          </div>
          <div className="edit-controls-wrapper">
            <OverlayTrigger placement="left" overlay={tooltip('Save')}>
              <Button bsStyle="link">
                <FontAwesomeIcon icon="save" />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="right" overlay={tooltip('Cancel')}>
              <Button bsStyle="link" onClick={this.handleCancelClick}>
                <FontAwesomeIcon icon="minus-circle" />
              </Button>
            </OverlayTrigger>
          </div>
          {/* 
            <ButtonToolbar>
            <Button bsStyle="primary" bsSize="small">Save</Button>
            <Button bsSize="small" onClick={this.handleCancelClick}>Cancel</Button>
          </ButtonToolbar>
          */}
        </div>
      </Form>
    );
  }
}

export default ListItemEditForm;
