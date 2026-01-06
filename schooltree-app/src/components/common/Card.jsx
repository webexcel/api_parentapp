import { clsx } from 'clsx';

function Card({ children, className, padding = 'md', hover = false, ...props }) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-100',
        hover && 'transition-shadow duration-200 hover:shadow-md',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Header
function CardHeader({ children, className, title, subtitle, action }) {
  if (title || subtitle || action) {
    return (
      <div className={clsx('flex items-start justify-between mb-4', className)}>
        <div>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  }

  return <div className={clsx('mb-4', className)}>{children}</div>;
}

// Card Body
function CardBody({ children, className }) {
  return <div className={className}>{children}</div>;
}

// Card Footer
function CardFooter({ children, className }) {
  return (
    <div className={clsx('mt-4 pt-4 border-t border-gray-100', className)}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
