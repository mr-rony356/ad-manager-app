import { useState } from "react";

export function Textfield(props) {
  const {
    id,
    name,
    value,
    onChange,
    pattern,
    placeholder,
    label,
    sublabel,
    required,
    type,
  } = props;

  const tempType = type || "text";

  return (
    <div className="inputBox">
      <span htmlFor={id}>
        {label}
        {required && "*"}
      </span>
      <input
        type={tempType}
        id={id}
        className="form__input form__input--textfield"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        pattern={pattern}
        placeholder={placeholder}
        required={required}
      />
      {sublabel && <label htmlFor={id}>{sublabel}</label>}
    </div>
  );
}

export function TextfieldShort(props) {
  const {
    id,
    name,
    value,
    onChange,
    pattern,
    placeholder,
    label,
    sublabel,
    required,
    type,
  } = props;

  const tempType = type || "text";
  const [charCount, setCharCount] = useState(value ? value.length : 0);

  const handleChange = (event) => {
    if (event.target.value.length <= 80) {
      setCharCount(event.target.value.length);
      onChange(event);
    }
  };

  return (
    <div className="inputBox">
      <span htmlFor={id}>
        {label}
        {required && "*"}
      </span>
      <input
        type={tempType}
        id={id}
        className="form__input--short form__input--textfield"
        name={name}
        value={value ?? ""}
        onChange={handleChange}
        pattern={pattern}
        placeholder={placeholder}
        required={required}
      />
      <div
        className="charCounter"
        style={{ backgroundColor: "var(--blue)", borderRadius: "5px" }}
      >
        {charCount}/80
      </div>

      {sublabel && <label htmlFor={id}>{sublabel}</label>}
    </div>
  );
}

export function TextFieldLong(props) {
  const {
    id,
    name,
    value,
    onChange,
    pattern,
    placeholder,
    label,
    sublabel,
    required,
  } = props;

  return (
    <div className="inputBox">
      <span htmlFor={id}>
        {label}
        {required && "*"}
      </span>
      <textarea
        rows={20}
        type="textarea"
        id={id}
        className="form__input form__input--textfieldlong"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        pattern={pattern}
        placeholder={placeholder}
        required={required}
      />
      {sublabel && <label htmlFor={id}>{sublabel}</label>}
    </div>
  );
}

export function Checkbox(props) {
  const { id, name, value, checked, onChange, label } = props;

  return (
    <div className="form__checkbox">
      <input
        type="checkbox"
        id={id}
        className="form__input form__input--checkbox"
        name={name}
        value={value ?? ""}
        checked={checked ?? false}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export function Radio(props) {
  const { id, name, value, checked, onChange, label, required } = props;

  return (
    <div className="form__radioButton">
      <input
        type="radio"
        id={id}
        className="form__input form__input--radio"
        name={name}
        value={value ?? ""}
        checked={checked ?? false}
        onChange={onChange}
        required={required}
      />
      <label className="" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export function Dropdown(props) {
  const {
    id,
    name,
    value,
    onChange,
    defaultOption,
    options,
    multiple,
    required,
  } = props;

  return (
    <>
      <select
        id={id}
        className="form__input form__input--select"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        multiple={multiple}
        required={required}
      >
        {defaultOption && (
          <option value="" disabled>
            {defaultOption}
          </option>
        )}
        {options && options.length > 0 && options.map((option) => option)}
      </select>
    </>
  );
}

export function Files(props) {
  const { id, name, onChange, accept, multiple, required } = props;

  const clickHandler = (event) => {
    event.preventDefault();
    document.getElementById(id).click();
  };

  return (
    <>
      <input
        type="file"
        id={id}
        className="form__input form__input--file button"
        name={name}
        onChange={onChange}
        accept={accept}
        multiple={multiple}
        required={required}
      />
      <button className="button" onClick={(e) => clickHandler(e)}>
        Upload
      </button>
    </>
  );
}

export function Slider(props) {
  const { id, name, onChange, required, tag, value } = props;

  return (
    <div className="verificationCheck">
      <label className="container">
        <input
          type="checkbox"
          id={id}
          checked={value}
          name={name}
          onChange={onChange}
          required={required}
        />
        <span className="checkmark"></span>
      </label>
      <p style={{ marginTop: "0.2em", padding: 0 }}>{tag}</p>
    </div>
  );
}
