export interface DialogProps {
  status: boolean;
  loading: boolean;
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
  name: string | number;
  image?: string;
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
export interface consoleTypeApi {
  id: number;
  name: string;
}
export interface consolePage {
  id: number;
  name: string;
  playedCost: number;
  loading: boolean;
  playedTime: { hours: number; minutes: number; seconds: number };
}
export interface food {
  id: number;
  name: string;
  cost: number;
}
export interface hourRate {
  id: number;
  name: number;
}
export interface bill {
  billFoods: {
    id: number;
    count: number;
    foodId: number;
    billId: number;
    cost: number;
    name: string;
  }[];
  endTime: Date;
  finalCost: number;
  hourRateId: number;
  id: number;
  paymentMethod: number;
  foodCost: number;
  startTime: Date;
  systemId: number;
  systemName: string;
}
export interface StartBillProps {
  dropListStatus: boolean;
  hourRateSelected: { id: number; name: number };
  consoleId: number;
}
