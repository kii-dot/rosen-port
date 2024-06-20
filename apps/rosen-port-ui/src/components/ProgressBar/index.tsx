export { ProgressBar };

import PropTypes from 'prop-types';

const ProgressBar = ({ amount, goal}:{amount:number, goal:number}) => {
  const percentage = (amount/goal)*100;
  const numTicks = 50;
  const ticks = Array.from({ length: numTicks }, (_, index) => (
    <div key={index} className={`w-1 h-full ${percentage >= (index + 1) * (100/numTicks) ? 'bg-teal-900' : 'bg-gray-300'}`}></div>
  ));

  return (
    <div className="w-full h-6 rounded-lg overflow-hidden relative">
      <div className="absolute inset-0 flex justify-between">
        {ticks}
      </div>
      <div className="h-full" style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

ProgressBar.propTypes = {
  amount: PropTypes.number.isRequired,
  goal: PropTypes.number,
};