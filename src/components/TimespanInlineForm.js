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
import { getExistingFormValues } from '../services/form-helper';
import { connect } from 'react-redux';

const tooltip = tip => <Tooltip id="tooltip">{tip}</Tooltip>;

const styles = {
  formControl: {
    margin: '0 5px'
  }
};

class TimespanInlineForm extends Component {
  constructor(props) {
    super(props);
    this.unEditedFormItem = undefined;
  }

  static propTypes = {
    item: PropTypes.object,
    cancelFn: PropTypes.func,
    saveFn: PropTypes.func
  };

  state = {
    beginTime: '',
    endTime: '',
    timespanTitle: ''
  };

  componentDidMount() {
    // Save the unedited, Form version of the item, so we can use it later
    this.unEditedFormItem = getExistingFormValues(
      this.props.item.id,
      this.props.smData
    );

    // Load existing form values
    this.setState(this.unEditedFormItem);
  }

  handleCancelClick = () => {
    this.props.cancelFn();
  };

  handleInputChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  handleSaveClick = () => {
    this.props.saveFn(this.props.smData);
  };

  render() {
    const { beginTime, endTime, timespanTitle } = this.state;

    return (
      <Form inline>
        <div className="row-wrapper">
          <div>
            <FormGroup controlId="timespanTitle">
              <ControlLabel>Title</ControlLabel>
              <FormControl
                type="text"
                style={styles.formControl}
                value={timespanTitle}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="beginTime">
              <ControlLabel>Begin Time</ControlLabel>
              <FormControl
                type="text"
                style={styles.formControl}
                value={beginTime}
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup controlId="endTime">
              <ControlLabel>End Time</ControlLabel>
              <FormControl
                type="text"
                style={styles.formControl}
                value={endTime}
                onChange={this.handleInputChange}
              />
            </FormGroup>
          </div>
          <div className="edit-controls-wrapper">
            <OverlayTrigger placement="left" overlay={tooltip('Save')}>
              <Button bsStyle="link">
                <FontAwesomeIcon icon="save" onClick={this.handleSaveClick} />
              </Button>
            </OverlayTrigger>
            <OverlayTrigger placement="right" overlay={tooltip('Cancel')}>
              <Button bsStyle="link" onClick={this.handleCancelClick}>
                <FontAwesomeIcon icon="minus-circle" />
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </Form>
    );
  }
}

const mapStateToProps = state => ({
  smData: state.smData
});

export default connect(mapStateToProps)(TimespanInlineForm);
