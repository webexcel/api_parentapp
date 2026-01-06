import { clsx } from 'clsx';
import { getInitials } from '../../utils/formatters';

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
  '2xl': 'h-20 w-20 text-xl',
};

const colors = [
  'bg-primary-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
];

function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className,
  ...props
}) {
  // Generate consistent color based on name
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const bgColor = colors[colorIndex];

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={clsx(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center text-white font-medium',
        sizes[size],
        bgColor,
        className
      )}
      {...props}
    >
      {getInitials(name)}
    </div>
  );
}

// Avatar Group
function AvatarGroup({ children, max = 4, size = 'md' }) {
  const childArray = Array.isArray(children) ? children : [children];
  const visibleChildren = childArray.slice(0, max);
  const remaining = childArray.length - max;

  return (
    <div className="flex -space-x-2">
      {visibleChildren.map((child, index) => (
        <div
          key={index}
          className="ring-2 ring-white rounded-full"
        >
          {child}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            'rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium ring-2 ring-white',
            sizes[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

Avatar.Group = AvatarGroup;

export default Avatar;
