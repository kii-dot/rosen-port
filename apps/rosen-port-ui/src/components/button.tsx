import classNames from 'classnames';

export { Button };

// eslint-disable-next-line react/prop-types
function Button({ onClick, disabled, children, className, disabledClassName }) {
  const isDisabledClass = 'bg-blue-500 text-white opacity-50 cursor-not-allowed';
  const isActive = 'bg-black text-white text-base py-2 px-4 rounded hover:bg-gray-700';

  return (
    <button
      className={classNames({
        [isDisabledClass]: disabled,
        [isActive]: !disabled,
        [className]: !disabled,
        [disabledClassName]: disabled,
      })}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
