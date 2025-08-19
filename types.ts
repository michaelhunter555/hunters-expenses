//form hook
/**
 * @name: Inputs
 * @description - Form Inputs for useForm() hook.
 */
export type Inputs = {
  value:
    | string
    | number
    | boolean
    | string[]
    | Record<string, any>[]
    | undefined;
  isValid: boolean;
};

/**
 * @name: State
 * @description - State of form hook.
 */
export type State = {
  inputs: Record<string, Inputs>;
  isValid: boolean;
};

/**
 * @name: InputChangeAction
 * @description - input changes in useForm hook.
 */
export type InputChangeAction = {
  type: "INPUT_CHANGE";
  value: string | number | boolean | string[];
  isValid: boolean;
  inputId: string;
};

/**
 * @name: SetFormAction
 * @description - set form to confirm if all fields ar evalid
 */
export type SetFormAction = {
  type: "SET_DATA";
  inputs: Record<string, Inputs>;
  formIsValid: boolean;
};

/**
 * @name: Action
 * @description - Action types for useForm hook
 */
export type Action = InputChangeAction | SetFormAction;
//endof formhook types

/**
 * @name: IncomeReport
 * @description - Type for addIncome() hook object
 */
export type IncomeReport = {
  totalAmount: number;
  dateOfTransaction?: Date;
  category: string;
  cogs: number;
  grossProfit?: number;
  taxAmount?: number;
  processingFees: number;
  netProfit?: number;
  comment?: string;
};

/**
 * @name: ExpenseReport
 * @description - Type for addExpnse() hook object
 */
export type ExpenseReport = {
  initialAmount: number;
  amountOwed?: number;
  lastUpdateDate?: Date;
  totalDeduction?: number;
  startDate?: Date;
  category: string;
  taxAmount?: number;
  comment: string;
};


interface IParticipantInfo {
  id: string;
  name: string;
  image: string;
  role: 'user' | 'barber' | 'admin';
}

export interface IChat {
  _id?: string,
  participants: string[]; // 2 user ids
  participantInfo: IParticipantInfo[]; // 2 objects
  lastMessage?: string;
  lastMessageTime?: Date;
  bookingId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  chatIsComplete?: boolean;

}

export interface IMessage {
  _id?: string,
  chatId: string,
  senderId: string,
  text: string,
  read: boolean,
  createdAt?: Date,
  updatedAt?: Date,
};