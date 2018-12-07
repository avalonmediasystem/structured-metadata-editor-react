import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as formActions from '../actions/show-forms';

class ModalContainer extends Component {

  render() {
    return (
      <Modal show={this.props.showForms.modal} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Text in a modal</h4>
          <p>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(mapStateToProps, formActions)(ModalContainer);
