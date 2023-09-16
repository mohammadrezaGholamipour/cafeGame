export interface Notification {
  textMain: string;
  textHeader: string;
  status: boolean;
  name: string;
  timer: number;
}
export interface LoginResponse {
  userState: number;
  token: string;
}
