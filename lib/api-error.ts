import { PlanName } from "./plan";

export class APIError {
  public readonly code: number;
  public readonly message: string;
  public readonly error?: any;

  public constructor(code: number, message: string, error?: any) {
    this.code = code;
    this.message = message;
    this.error = error;
  }
}

export class APIPlanError extends APIError {
  public constructor(action?: string) {
    super(
      400,
      `Your plan does not allow ${
        action ?? "this action"
      }. Please upgrade your plan to a higher tier. See '/pricing' for more information.`
    );
  }
}
