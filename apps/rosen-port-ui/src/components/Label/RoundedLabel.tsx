import classNames from 'classnames';

interface RoundedLabelProps {
  name: string;
  icon?: string;
  id: string;
  iconOnly?: boolean;
  className?: string;
}

interface RoundedLabelButtonProps {
  name: string;
  icon?: string;
  id: string;
  iconOnly?: boolean;
  className?: string;
  bgClassName?: string;
  iconClassName?: string;
  ClassName?: string;
  onClick?: React.MouseEventHandler;
}

export const RoundedLabel = ({ name, icon, id, iconOnly, className }: RoundedLabelProps) => {
  return (
    <div className="flex flex-row">
      <div
        className={classNames('flex flex-row items-center py-1', iconOnly ? '' : 'bg-indigo-200/20 rounded-full px-2')}
      >
        {icon !== undefined ? <img src={icon} alt="" className="h-4 w-4 flex-shrink-0 rounded-full" /> : null}

        {iconOnly ? null : (
          <span className={classNames('hidden truncate sm:ml-2 sm:block text-white font-thin text-xs', className)}>
            {id === null ? 'Select Network' : name}
          </span>
        )}
      </div>
    </div>
  );
};

export const RoundedLabelButton = ({
  name,
  icon,
  id,
  iconOnly,
  className,
  bgClassName,
  iconClassName,
  onClick,
}: RoundedLabelButtonProps) => {
  return (
    <button onClick={onClick} className="flex flex-row">
      <div
        className={classNames(
          bgClassName,
          'flex flex-row items-center py-1',
          iconOnly ? '' : 'bg-indigo-200/20 rounded-full px-2',
        )}
      >
        {icon !== undefined ? (
          <img src={icon} alt="" className={classNames('h-4 w-4 flex-shrink-0 rounded-full', iconClassName)} />
        ) : null}

        {iconOnly ? null : (
          <span className={classNames('hidden truncate sm:ml-2 sm:block text-white font-thin', className)}>
            {id === null ? 'Select Network' : name}
          </span>
        )}
      </div>
    </button>
  );
};
