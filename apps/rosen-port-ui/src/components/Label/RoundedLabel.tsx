import classNames from 'classnames';

interface RoundedLabelProps {
  name: string;
  icon: string;
  id: string;
  iconOnly?: boolean;
}

export const RoundedLabel = ({ name, icon, id, iconOnly }: RoundedLabelProps) => {
  return (
    <div className="flex flex-row">
      <div
        className={classNames('flex flex-row items-center py-1', iconOnly ? '' : 'bg-indigo-200/20 rounded-full px-2')}
      >
        <img src={icon} alt="" className="h-4 w-4 flex-shrink-0 rounded-full" />

        {iconOnly ? null : (
          <span className={classNames('hidden truncate text-xs sm:ml-2 sm:block')}>
            {id === null ? 'Select Network' : name}
          </span>
        )}
      </div>
    </div>
  );
};
