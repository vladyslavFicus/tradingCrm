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
  AFFILIATE_PARTNER: null,
  AFFILIATE_MANAGER: null,
});

export const userTypeLabels = {
  [userTypes.COMPANY_ADMIN]: 'CONSTANTS.HIERARCHY.USER_TYPES.COMPANY_ADMIN',
  [userTypes.BRAND_ADMIN]: 'CONSTANTS.HIERARCHY.USER_TYPES.BRAND_ADMIN',
  [userTypes.SALES_HOD]: 'CONSTANTS.HIERARCHY.USER_TYPES.SALES_HOD',
  [userTypes.RETENTION_HOD]: 'CONSTANTS.HIERARCHY.USER_TYPES.RETENTION_HOD',
  [userTypes.SUPPORT_HOD]: 'CONSTANTS.HIERARCHY.USER_TYPES.SUPPORT_HOD',
  [userTypes.PSP_HOD]: 'CONSTANTS.HIERARCHY.USER_TYPES.PSP_HOD',
  [userTypes.SALES_MANAGER]: 'CONSTANTS.HIERARCHY.USER_TYPES.SALES_MANAGER',
  [userTypes.RETENTION_MANAGER]: 'CONSTANTS.HIERARCHY.USER_TYPES.RETENTION_MANAGER',
  [userTypes.SUPPORT_MANAGER]: 'CONSTANTS.HIERARCHY.USER_TYPES.SUPPORT_MANAGER',
  [userTypes.PSP_MANAGER]: 'CONSTANTS.HIERARCHY.USER_TYPES.PSP_MANAGER',
  [userTypes.BO_MANAGER]: 'CONSTANTS.HIERARCHY.USER_TYPES.BO_MANAGER',
  [userTypes.COMPLIANCE_MANAGER]: 'CONSTANTS.HIERARCHY.USER_TYPES.COMPLIANCE_MANAGER',
  [userTypes.OPERATIONS_MANAGER]: 'CONSTANTS.HIERARCHY.USER_TYPES.OPERATIONS_MANAGER',
  [userTypes.DEALING_MANAGER]: 'CONSTANTS.HIERARCHY.USER_TYPES.DEALING_MANAGER',
  [userTypes.SALES_LEAD]: 'CONSTANTS.HIERARCHY.USER_TYPES.SALES_LEAD',
  [userTypes.RETENTION_LEAD]: 'CONSTANTS.HIERARCHY.USER_TYPES.RETENTION_LEAD',
  [userTypes.SUPPORT_LEAD]: 'CONSTANTS.HIERARCHY.USER_TYPES.SUPPORT_LEAD',
  [userTypes.SALES_AGENT]: 'CONSTANTS.HIERARCHY.USER_TYPES.SALES_AGENT',
  [userTypes.RETENTION_AGENT]: 'CONSTANTS.HIERARCHY.USER_TYPES.RETENTION_AGENT',
  [userTypes.SUPPORT_AGENT]: 'CONSTANTS.HIERARCHY.USER_TYPES.SUPPORT_AGENT',
  [userTypes.CUSTOMER]: 'CONSTANTS.HIERARCHY.USER_TYPES.CUSTOMER',
  [userTypes.LEAD_CUSTOMER]: 'CONSTANTS.HIERARCHY.USER_TYPES.LEAD_CUSTOMER',
  [userTypes.AFFILIATE_PARTNER]: 'CONSTANTS.HIERARCHY.USER_TYPES.AFFILIATE_PARTNER',
  [userTypes.AFFILIATE_MANAGER]: 'CONSTANTS.HIERARCHY.USER_TYPES.AFFILIATE_MANAGER',
};

export const deskTypes = keyMirror({
  RETENTION: null,
  SALES: null,
});
