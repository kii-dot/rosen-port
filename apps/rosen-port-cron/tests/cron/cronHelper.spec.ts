import { describe, expect } from 'vitest';
import { getCronString, TimeType, CronString } from '../../src/cron/cronHelper';

describe('GetCronString', () => {
  const secondsCronString = {
    value: 10,
    time: TimeType.seconds,
  };
  const minutesCronString = {
    value: 5,
    time: TimeType.minutes,
  };
  const hoursCronString = {
    value: 3,
    time: TimeType.hours,
  };

  const secondsCronStringExpected = `*/${secondsCronString.value} * * * * *`;
  const minutesCronStringExpected = `*/${minutesCronString.value} * * * *`;
  const hoursCronStringExpected = `*/${hoursCronString.value} * * *`;

  const secondsCronStringGenerated: string = getCronString(secondsCronString);
  const minutesCronStringGenerated: string = getCronString(minutesCronString);
  const hoursCronStringGenerated: string = getCronString(hoursCronString);

  expect(secondsCronStringGenerated).toBe(secondsCronStringExpected);
  expect(minutesCronStringGenerated).toBe(minutesCronStringExpected);
  expect(hoursCronStringGenerated).toBe(hoursCronStringExpected);
});
