export type Agent = {
  uuid: string,
  fullName: string,
};

export type Operator = {
  uuid: string,
  fullName: string | null,
  operatorStatus: string | null,
};

export type FormValues = {
  agentId: string,
};
