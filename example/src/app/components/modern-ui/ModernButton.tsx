import React from 'react';
import './ModernButton.scss';

interface ModernButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = ''
}) => {
  const buttonClass = [
    'modern-btn',
    `modern-btn-${variant}`,
    `modern-btn-${size}`,
    fullWidth ? 'modern-btn-full' : '',
    loading ? 'modern-btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="modern-btn-spinner"></span>
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="modern-btn-icon modern-btn-icon-left">{icon}</span>
      )}
      <span className="modern-btn-text">{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="modern-btn-icon modern-btn-icon-right">{icon}</span>
      )}
    </button>
  );
};
