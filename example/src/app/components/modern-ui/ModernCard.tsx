import React from 'react';
import './ModernCard.scss';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  shadow = 'md',
  onClick
}) => {
  const paddingClass = `modern-card-padding-${padding}`;
  const shadowClass = `modern-card-shadow-${shadow}`;
  const hoverClass = hover ? 'modern-card-hover' : '';

  return (
    <div
      className={`modern-card ${paddingClass} ${shadowClass} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface ModernCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const ModernCardHeader: React.FC<ModernCardHeaderProps> = ({
  title,
  subtitle,
  action,
  className = ''
}) => {
  return (
    <div className={`modern-card-header ${className}`}>
      <div className="modern-card-header-content">
        <h3 className="modern-card-title">{title}</h3>
        {subtitle && <p className="modern-card-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="modern-card-header-action">{action}</div>}
    </div>
  );
};

interface ModernCardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModernCardBody: React.FC<ModernCardBodyProps> = ({
  children,
  className = ''
}) => {
  return <div className={`modern-card-body ${className}`}>{children}</div>;
};
