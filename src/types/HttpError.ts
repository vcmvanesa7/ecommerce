export interface HttpError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
