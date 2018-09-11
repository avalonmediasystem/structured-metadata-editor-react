import React, { Component } from 'react';
import HeadingForm from '../components/HeadingForm';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import * as actions from '../actions/sm-data';

class HeadingFormContainer extends Component {
  prepData(values) {
    let returnObj = {
      type: 'div',
      label: values.headingInputTitle,
      parent: values.headingSelectChildOf
    };

    const numChildren = this.props.smData.filter(
      item => item.parent === values.headingSelectChildOf
    ).length;
    returnObj.id = `${returnObj.parent}-${numChildren + 1}`;

    console.log('returnObj', returnObj);
    return returnObj;
  }

  submit = values => {
    console.log('values', values);
    const data = this.prepData(values);
    // Update redux store
    this.props.addHeading(data);
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

const mapDispatchToProps = dispatch => ({
  addHeading: values => dispatch(actions.addHeading(values))
});

const mapStateToProps = state => ({
  showForms: state.showForms,
  smData: state.smData
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeadingFormContainer);
