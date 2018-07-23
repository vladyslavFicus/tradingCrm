import I18n from '../../../../utils/fake-i18n';
import { statusTypes as kysStatusTypes, statuses as kycStatuses } from '../../../../constants/kyc';

const statusTypesKeys = {
  [kysStatusTypes.ADDRESS]: 'kycAddressStatus',
  [kysStatusTypes.IDENTITY]: 'kycPersonalStatus',
};

const multiselectStatuses = {
  [kysStatusTypes.FULLY_VERIFIED]: I18n.t('KYC_REQUESTS.FILTER.STATUS.FULLY_VERIFIED'),
  [`${statusTypesKeys[kysStatusTypes.IDENTITY]}.${kycStatuses.VERIFIED}`]:
    I18n.t('KYC_REQUESTS.FILTER.STATUS.IDENTITY_VERIFIED'),
  [`${statusTypesKeys[kysStatusTypes.IDENTITY]}.${kycStatuses.PENDING}`]:
    I18n.t('KYC_REQUESTS.FILTER.STATUS.IDENTITY_PENDING'),
  [`${statusTypesKeys[kysStatusTypes.IDENTITY]}.${kycStatuses.DOCUMENTS_SENT}`]:
    I18n.t('KYC_REQUESTS.FILTER.STATUS.IDENTITY_DOCUMENT_SENT'),
  [`${statusTypesKeys[kysStatusTypes.ADDRESS]}.${kycStatuses.VERIFIED}`]:
    I18n.t('KYC_REQUESTS.FILTER.STATUS.ADDRESS_VERIFIED'),
  [`${statusTypesKeys[kysStatusTypes.ADDRESS]}.${kycStatuses.PENDING}`]:
    I18n.t('KYC_REQUESTS.FILTER.STATUS.ADDRESS_PENDING'),
  [`${statusTypesKeys[kysStatusTypes.ADDRESS]}.${kycStatuses.DOCUMENTS_SENT}`]:
    I18n.t('KYC_REQUESTS.FILTER.STATUS.ADDRESS_DOCUMENT_SENT'),
};

export {
  statusTypesKeys,
  multiselectStatuses,
};
