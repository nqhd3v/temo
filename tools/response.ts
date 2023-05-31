export default class ResponseObj {
  public static success<T>(data: T): IResponseObject<T> {
    return {
      isSuccess: true,
      data,
    };
  }
  public static fail<T>(message: string): IResponseObject<T> {
    return {
      isSuccess: false,
      message,
    };
  }
}

export interface IResponseObject<T> {
  isSuccess: boolean;
  message?: string;
  data?: T;
}
