import React, { Component } from 'react';
import TimespanForm from '../components/TimespanForm';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';

class TimespanFormContainer extends Component {
  submit = values => {
    console.log('values', values);
  };

  render() {
    const { timespan } = this.props.showForms;

    return (
      <CSSTransitionGroup
        transitionName="example"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {timespan ? <TimespanForm onSubmit={this.submit} /> : null}
      </CSSTransitionGroup>
    );
  }
}

const mapStateToProps = state => ({
  showForms: state.showForms
});

export default connect(mapStateToProps)(TimespanFormContainer);
