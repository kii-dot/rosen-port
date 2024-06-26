export { ProgressBar };

import classNames from 'classnames';
import PropTypes from 'prop-types';

const ProgressBar = ({ amount, goal }: { amount: number; goal: number }) => {
  const percentage = (amount / goal) * 100;
  const numTicks = 80;
  const ticks = Array.from({ length: numTicks }, (_, index) => (
    <div
      key={index}
      className={classNames(
        'w-0.5 h-full',
        percentage >= (index + 1) * (130 / numTicks) ? 'bg-teal-400' : 'bg-gray-300/10',
      )}
    ></div>
  ));

  return (
    <div className="w-full h-4 overflow-hidden relative">
      <div className="absolute inset-0 flex justify-between">{ticks}</div>
      <div className="h-full" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

ProgressBar.propTypes = {
  amount: PropTypes.number.isRequired,
  goal: PropTypes.number,
};
