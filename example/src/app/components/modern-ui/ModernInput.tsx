import React from 'react';
import './ModernInput.scss';

interface ModernInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  error?: string;
  label?: string;
  name?: string;
  id?: string;
}

export const ModernInput: React.FC<ModernInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  error,
  label,
  name,
  id
}) => {
  const inputClass = [
    'modern-input-field',
    icon ? `modern-input-with-icon-${iconPosition}` : '',
    error ? 'modern-input-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className='modern-input-wrapper'>
      {label && (
        <label htmlFor={id} className='modern-input-label'>
          {label}
          {required && <span className='modern-input-required'>*</span>}
        </label>
      )}
      <div className='modern-input-container'>
        {icon && iconPosition === 'left' && (
          <div className='modern-input-icon modern-input-icon-left'>{icon}</div>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClass}
          disabled={disabled}
          required={required}
        />
        {icon && iconPosition === 'right' && (
          <div className='modern-input-icon modern-input-icon-right'>{icon}</div>
        )}
      </div>
      {error && <div className='modern-input-error-message'>{error}</div>}
    </div>
  );
};

interface ModernTextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  error?: string;
  label?: string;
  name?: string;
  id?: string;
}

export const ModernTextarea: React.FC<ModernTextareaProps> = ({
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  required = false,
  rows = 4,
  error,
  label,
  name,
  id
}) => {
  const textareaClass = [
    'modern-textarea',
    error ? 'modern-input-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className='modern-input-wrapper'>
      {label && (
        <label htmlFor={id} className='modern-input-label'>
          {label}
          {required && <span className='modern-input-required'>*</span>}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={textareaClass}
        disabled={disabled}
        required={required}
        rows={rows}
      />
      {error && <div className='modern-input-error-message'>{error}</div>}
    </div>
  );
};

interface ModernSelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  name?: string;
  id?: string;
  children: React.ReactNode;
}

export const ModernSelect: React.FC<ModernSelectProps> = ({
  value,
  onChange,
  className = '',
  disabled = false,
  required = false,
  error,
  label,
  name,
  id,
  children
}) => {
  const selectClass = [
    'modern-select',
    error ? 'modern-input-error' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className='modern-input-wrapper'>
      {label && (
        <label htmlFor={id} className='modern-input-label'>
          {label}
          {required && <span className='modern-input-required'>*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={selectClass}
        disabled={disabled}
        required={required}
      >
        {children}
      </select>
      {error && <div className='modern-input-error-message'>{error}</div>}
    </div>
  );
};
