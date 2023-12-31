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
  costFood: number;
  loading: boolean;
  billFood: billFood[];
  optionStatus: boolean;
  customMoney: number;
  alarmStatus: boolean;
  timer: { hours: number; minutes: number; seconds: number };
}
export interface consoleTypeApi {
  id: number;
  name: string;
}
export interface alarmInLocalStorage {
  hour: number;
  consoleId: number;
  minute: number;
}
export interface CustomMoneyInLocalStorage {
  money: number;
  consoleId: number;
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
export interface foodStore {
  id: number;
  name: string;
  cost: number;
  count: number;
}
export interface hourRate {
  id: number;
  name: number;
}
export interface billFood {
  id: number;
  count: number;
  foodId: number;
  billId: number;
  cost: number;
  name: string;
}
export interface bill {
  billFoods: billFood[];
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
export interface highlight {
  title: string;
  description: string;
  showButtons?: ("open" | "close" | "next")[];
}
export interface highlightStep {
  element: string;
  popover: {
    title: string;
    description: string;
    showButtons?: ("open" | "close" | "next")[];
  };
}
export interface Table {
  largTable?: boolean;
  header: string[];
}
