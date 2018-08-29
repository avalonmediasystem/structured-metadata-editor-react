import React from 'react';
import { Field, reduxForm } from 'redux-form';

let TimespanForm = props => {
  const { handleSubmit } = props;

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add New Time Span</h4>
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="timeSpanSelectChildOf">Child of</label>
            <Field
              name="timeSpanSelectChildOf"
              component="select"
              className="form-control"
            >
              <option value="">None</option>
            </Field>
          </div>
          <div className="form-group">
            <label htmlFor="timeSpanInputTitle">Title</label>
            <Field
              name="timeSpanInputTitle"
              component="input"
              type="text"
              className="form-control"
              placeholder="Enter Title"
            />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="timeSpanInputStartTime">Start</label>
            <Field
              name="timeSpanInputStartTime"
              component="input"
              type="text"
              className="form-control"
              placeholder="00:00:00"
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeSpanInputEndTime">End</label>
            <Field
              name="timeSpanInputEndTime"
              component="input"
              type="text"
              className="form-control"
              placeholder="00:00:00"
            />
          </div>
        </div>
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

TimespanForm = reduxForm({
  form: 'timespan'
})(TimespanForm);

export default TimespanForm;
