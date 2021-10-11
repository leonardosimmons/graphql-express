export type AccessToken = {
  readonly token: string;
};

export type Combinable = number | string;

export type HttpError = Error & {
  statusCode?: number;
  log?: string;
};
