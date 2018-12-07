import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as formActions from '../actions/show-forms';
import HeadingFormContainer from './HeadingFormContainer';
import TimespanFormContainer from './TimespanFormContainer';

class ModalContainer extends Component {
  render() {
    const { listItemType } = this.props.showForms;

    return (
      <Modal show={this.props.showForms.modal} onHide={this.props.closeModal}>
        {listItemType === 'div' && <HeadingFormContainer />}
        {listItemType === 'span' && <TimespanFormContainer />}
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(
  mapStateToProps,
  formActions
)(ModalContainer);
