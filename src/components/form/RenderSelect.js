import React from 'react';

const RenderSelect = ({
  input,
  label,
  name,
  options,
  meta: { touched, error }
}) => (
  <div className={`form-group ${touched && error ? 'has-error' : ''}`}>
    <label className="control-label" htmlFor={name}>
      {label}
    </label>
    <select
      name={name}
      className="form-control"
      onChange={e => input.onChange(e.target.value)}
    >
      <option value="">Select one...</option>
      {options}
    </select>
  </div>
);

export default RenderSelect;
