import keyMirror from 'keymirror';

export const branchTypes = keyMirror({
  OFFICE: null,
  DESK: null,
  TEAM: null,
  COMPANY: null,
  BRAND: null,
});

export const userTypes = keyMirror({
  COMPANY_ADMIN: null,
  BRAND_ADMIN: null,
  SALES_HOD: null,
  RETENTION_HOD: null,
  SUPPORT_HOD: null,
  PSP_HOD: null,
  SALES_MANAGER: null,
  RETENTION_MANAGER: null,
  SUPPORT_MANAGER: null,
  PSP_MANAGER: null,
  BO_MANAGER: null,
  COMPLIANCE_MANAGER: null,
  OPERATIONS_MANAGER: null,
  DEALING_MANAGER: null,
  SALES_LEAD: null,
  RETENTION_LEAD: null,
  SUPPORT_LEAD: null,
  SALES_AGENT: null,
  RETENTION_AGENT: null,
  SUPPORT_AGENT: null,
  CUSTOMER: null,
  LEAD_CUSTOMER: null,
});
