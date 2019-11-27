import { statusTypes as kysStatusTypes, statuses as kycStatuses } from '../../../../constants/kyc';

const statusTypesKeys = {
  [kysStatusTypes.ADDRESS]: 'kycAddressStatus',
  [kysStatusTypes.IDENTITY]: 'kycPersonalStatus',
};

const multiselectStatuses = {
  [kysStatusTypes.FULLY_VERIFIED]: 'KYC_REQUESTS.FILTER.STATUS.FULLY_VERIFIED',
  [`${statusTypesKeys[kysStatusTypes.IDENTITY]}.${kycStatuses.VERIFIED}`]:
    'KYC_REQUESTS.FILTER.STATUS.IDENTITY_VERIFIED',
  [`${statusTypesKeys[kysStatusTypes.IDENTITY]}.${kycStatuses.PENDING}`]:
    'KYC_REQUESTS.FILTER.STATUS.IDENTITY_PENDING',
  [`${statusTypesKeys[kysStatusTypes.IDENTITY]}.${kycStatuses.DOCUMENTS_SENT}`]:
    'KYC_REQUESTS.FILTER.STATUS.IDENTITY_DOCUMENT_SENT',
  [`${statusTypesKeys[kysStatusTypes.ADDRESS]}.${kycStatuses.VERIFIED}`]:
    'KYC_REQUESTS.FILTER.STATUS.ADDRESS_VERIFIED',
  [`${statusTypesKeys[kysStatusTypes.ADDRESS]}.${kycStatuses.PENDING}`]:
    'KYC_REQUESTS.FILTER.STATUS.ADDRESS_PENDING',
  [`${statusTypesKeys[kysStatusTypes.ADDRESS]}.${kycStatuses.DOCUMENTS_SENT}`]:
    'KYC_REQUESTS.FILTER.STATUS.ADDRESS_DOCUMENT_SENT',
};

export {
  statusTypesKeys,
  multiselectStatuses,
};
