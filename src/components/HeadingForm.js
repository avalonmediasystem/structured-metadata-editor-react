import React from 'react';
import { Field, reduxForm } from 'redux-form';

let HeadingForm = props => {
  const { handleSubmit } = props;

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add New Heading</h4>
      <div className="form-group">
        <label htmlFor="headingSelectChildOf">Child of</label>
        <Field
          name="headingSelectChildOf"
          component="select"
          className="form-control"
        >
          <option value="">None</option>
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
        Save
      </button>
      <button type="button" className="btn btn-light cancel-button">
        Cancel
      </button>
    </form>
  );
};

HeadingForm = reduxForm({
  form: 'heading'
})(HeadingForm);

export default HeadingForm;
