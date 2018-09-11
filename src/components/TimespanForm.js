import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { ButtonToolbar, Button } from 'react-bootstrap';

let TimespanForm = props => {
  const { handleSubmit, submitting } = props;

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
      <ButtonToolbar>
        <Button bsStyle="primary" type="submit" disabled={submitting}>Add</Button>
        <Button>Cancel</Button>
      </ButtonToolbar>
    </form>
  );
};

TimespanForm = reduxForm({
  form: 'timespan'
})(TimespanForm);

export default TimespanForm;
