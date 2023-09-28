export interface DialogProps {
  status: boolean;
  header: boolean;
  width: number;
  headerText?: string;
  footer: boolean;
  btnAccept?: boolean;
  btnCancel?: boolean;
  btnAcceptText?: string;
  btnCancelText?: string;
}
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
export interface DropList {
  id: number;
  name: string;
  image: string;
}
export interface DropListProps {
  data: DropList[];
  space: string;
  status: boolean;
}
export interface Register {
  userName: string;
  email: string;
  password: string;
  repeatPassword: string;
  mobile: string;
}
