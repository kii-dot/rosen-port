type CronString = {
  value: number;
  time: TimeType;
};

enum TimeType {
  seconds,
  minutes,
  hours,
}

function getCronString(cronString: CronString): string {
  switch (cronString.time) {
    case TimeType.seconds:
      return `*/${cronString.value} * * * * *`;
    case TimeType.minutes:
      return `*/${cronString.value} * * * *`;
    case TimeType.hours:
      return `*/${cronString.value} * * *`;
    default:
      throw new Error('No value defined');
  }
}

export { getCronString, TimeType, CronString };
