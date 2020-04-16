const attributeLabels = {
  department: 'PARTNERS.PROFILE.DEPARTMENTS.LABELS.DEPARTMENT',
  role: 'PARTNERS.PROFILE.DEPARTMENTS.LABELS.ROLE',
};

const personalFormAttributeLabels = {
  firstName: 'PARTNERS.PROFILE.PERSONAL_FORM.LABELS.FIRST_NAME',
  lastName: 'PARTNERS.PROFILE.PERSONAL_FORM.LABELS.LAST_NAME',
  country: 'PARTNERS.PROFILE.PERSONAL_FORM.LABELS.COUNTRY',
  phoneNumber: 'PARTNERS.PROFILE.PERSONAL_FORM.LABELS.PHONE',
  email: 'COMMON.EMAIL',
  whiteListedIps: 'PARTNERS.PROFILE.PERSONAL_FORM.LABELS.WHITE_LISTED_IP',
  restrictedCountries: 'PARTNERS.PROFILE.PERSONAL_FORM.LABELS.RESTRICTED_COUNTRIES',
  affiliateType: 'COMMON.PARTNER_TYPE',
  externalAffiliateId: 'COMMON.EXTERNAL_AFILIATE_ID',
  public: 'PARTNERS.PROFILE.PERSONAL_FORM.PUBLIC_CHECKBOX',
  cellexpert: 'PARTNERS.PROFILE.PERSONAL_FORM.CELLEXPERT_CHECKBOX',
};

const autoCreationOptions = {
  ALLOW: {
    label: 'PARTNERS.PROFILE.PERSONAL_FORM.AUTOCREATION_TRADING_ACCOUNT_OPTIONS.ALLOW',
    value: 'ALLOW',
  },
  DENIED: {
    label: 'PARTNERS.PROFILE.PERSONAL_FORM.AUTOCREATION_TRADING_ACCOUNT_OPTIONS.DENIED',
    value: 'DENIED',
  },
  DEPENDS_ON_BRAND_CONFIG: {
    label: 'PARTNERS.PROFILE.PERSONAL_FORM.AUTOCREATION_TRADING_ACCOUNT_OPTIONS.DEPENDS_ON_BRAND',
    value: 'DEPENDS_ON_BRAND_CONFIG',
  },
};

export {
  attributeLabels,
  autoCreationOptions,
  personalFormAttributeLabels,
};

export default attributeLabels;
