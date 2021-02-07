import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group row">
      <label htmlFor={name} className="col-sm-2 col-form-label">
        {label}
      </label>
      <div className="col-sm-10">
        <input id={name} name={name} className="form-control" {...rest} />
        {error && <span className="error-message">{error}</span>}
      </div>
    </div>
  );
};

export default Input;