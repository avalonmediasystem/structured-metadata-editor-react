import React, { Component } from 'react';
import HeadingForm from '../components/HeadingForm';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';

class HeadingFormContainer extends Component {
  submit = values => {
    console.log('values', values);
  };

  render() {
    const { heading } = this.props.showForms;

    return (
      <CSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {heading ? <HeadingForm onSubmit={this.submit} key={1} /> : null}
      </CSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(mapStateToProps)(HeadingFormContainer);
