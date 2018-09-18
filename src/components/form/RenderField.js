import React from 'react';

const RenderField = ({
  input,
  label,
  name,
  type,
  placeholder,
  meta: { touched, error }
}) => (
  <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
    <label className="control-label" htmlFor={name}>
      {label}
    </label>
    <input
      className="form-control"
      {...input}
      placeholder={placeholder}
      type={type}
    />
    <span className="text-danger">{touched && error}</span>
  </div>
);

export default RenderField;
