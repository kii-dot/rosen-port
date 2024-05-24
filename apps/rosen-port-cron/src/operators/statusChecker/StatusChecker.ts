import { NotImplementedException } from '@rosen-port/errors';
import { Executor } from '../../types/executor';
import { IStatusChecker } from './types';

export class StatusChecker extends Executor implements IStatusChecker {
  onBeforeExecute(): Promise<void> {
    throw new NotImplementedException();
  }
  onAfterExecute(): Promise<void> {
    throw new NotImplementedException();
  }
  onExecute(): Promise<void> {
    throw new NotImplementedException();
  }
}
