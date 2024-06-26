export class Retry {
  retryCount: number;
  func: () => boolean;
  constructor(retryCount: number, func: () => boolean) {
    this.retryCount = retryCount;
    this.func = func;
  }

  async execute() {
    var isSucceeded = false;
    for (var index = 0; index < this.retryCount; index++) {
      isSucceeded = await this.func();
      if (isSucceeded) {
        break;
      }
    }
  }
}
