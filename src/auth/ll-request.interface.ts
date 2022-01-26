export interface LlRequest extends Request {
  user: {
    userId: string;
    clientId: string;
    roles: string | string[];
  };
}
