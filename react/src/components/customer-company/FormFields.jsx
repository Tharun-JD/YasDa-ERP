function FieldShell({ label, name, error, required, children }) {
  return (
    <label className="cc-field" htmlFor={name}>
      <span className="cc-label">
        {label}
        {required ? <span className="cc-required">*</span> : null}
      </span>
      {children}
      {error ? <span className="cc-error">{error}</span> : null}
    </label>
  )
}

export function TextField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = true,
  type = 'text',
  placeholder = '',
  inputMode,
  maxLength,
  min,
  autoComplete = 'off',
}) {
  return (
    <FieldShell label={label} name={name} error={error} required={required}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        min={min}
        autoComplete={autoComplete}
        className={`cc-input ${error ? 'cc-input-error' : ''}`}
      />
    </FieldShell>
  )
}

export function SelectField({ label, name, value, onChange, onBlur, error, options, required = true, autoComplete = 'off' }) {
  return (
    <FieldShell label={label} name={name} error={error} required={required}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        className={`cc-input ${error ? 'cc-input-error' : ''}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}
