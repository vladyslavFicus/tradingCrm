export type FormValues = {
  tradeId: number,
  loginIds: Array<number>,
  operationType: string,
  symbol: string,
  agentIds: string,
  volumeFrom: number,
  volumeTo: number,
  status: string,
  tradeType: string,
  platformType: string,
};

type Hierarchy = {
  uuid: string,
  userType: string,
}

export type OriginalAgent = {
  uuid: string,
  fullName: string | null,
  operatorStatus: string | null,
  hierarchy: Hierarchy | null,
}

export type Accounts = {
  login: number,
  platformType: string,
};
