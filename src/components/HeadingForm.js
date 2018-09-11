import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

let HeadingForm = props => {
  const { handleSubmit, smData } = props;
  let options = smData.map((item, i) => {
    if (item.type === 'div') {
      return (
        <option value={item.id} key={item.id}>
          {item.label}
        </option>
      );
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add New Heading</h4>
      <div className="form-group">
        <label htmlFor="headingSelectChildOf">Child of</label>
        <Field
          name="headingSelectChildOf"
          component="select"
          className="form-control"
          value={1}
        >
          {options}
        </Field>
      </div>
      <div className="form-group">
        <label htmlFor="headingInputTitle">Title</label>
        <Field
          name="headingInputTitle"
          component="input"
          type="text"
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-default">
        Add
      </button>
      <button type="button" className="btn btn-light cancel-button">
        Cancel
      </button>
    </form>
  );
};

const mapStateToProps = state => ({
  smData: state.smData
});

HeadingForm = reduxForm({
  form: 'heading'
})(HeadingForm);

export default connect(mapStateToProps)(HeadingForm);
