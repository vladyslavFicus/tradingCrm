type AuthoritiesOperator = {
  department?: string,
  roles?: Array<string>,
};

export type FormValues = {
  searchBy?: string,
  country?: string,
  status?: string,
  offices?: Array<string>,
  desks?: Array<string>,
  teams?: Array<string>,
  authorities?: AuthoritiesOperator,
};
