import React from 'react';

const RenderField = ({
  input,
  label,
  name,
  type,
  meta: { touched, error }
}) => (
  <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
    <label className="control-label" htmlFor={name}>
      {label}
    </label>
    <input
      className="form-control"
      {...input}
      placeholder={label}
      type={type}
    />
  </div>
);

export default RenderField;
