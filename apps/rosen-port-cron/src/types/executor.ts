abstract class Executor {
  abstract onBeforeExecute(): Promise<void>;
  abstract onAfterExecute(): Promise<void>;
  abstract onExecute(): Promise<void>;
  async execute(): Promise<void> {
    await this.onBeforeExecute();
    await this.onExecute();
    await this.onAfterExecute();
  }
}

export { Executor };
