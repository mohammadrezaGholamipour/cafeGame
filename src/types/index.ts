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
export interface AccountResponse {
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
  element: string;
}
export interface Register {
  userName: string;
  email: string;
  password: string;
  repeatPassword: string;
  mobile: string;
}
export interface home {
  consoleId: number;
  billId: number;
  name: string;
  status: boolean;
  dropListStatus: boolean;
  hourRate: number;
  interval?: number;
  costPlayed: number;
  loading: boolean;
  timer: { hours: number; minutes: number; seconds: number };
}
export interface console {
  id: number;
  name: string;
}
export interface hourRate {
  id: number;
  rate: number;
}
export interface bill {
  billFoods: { id: number; count: number; foodId: number; billId: number }[];
  endTime: string;
  finalCost: number;
  hourRateId: number;
  id: number;
  paymentMethod: number;
  startTime: string;
  systemId: number;
}
