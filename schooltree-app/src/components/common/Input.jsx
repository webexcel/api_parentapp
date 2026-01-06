import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className,
    inputClassName,
    disabled = false,
    required = false,
    type = 'text',
    ...props
  },
  ref
) {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={clsx(
            'w-full px-4 py-2.5 border rounded-lg transition-colors duration-200',
            'focus:outline-none focus:ring-2',
            'placeholder:text-gray-400',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            inputClassName
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={clsx('mt-1.5 text-sm', error ? 'text-red-500' : 'text-gray-500')}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

export default Input;
