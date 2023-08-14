import _ from 'lodash';
import { BackOfficeBrand } from '../types/config';

const config = _.merge({
  components: {
    Currency: {
      currencies: {},
    },
  },
  player: {
    files: {
      maxSize: 20,
      types: [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
        'application/msword', // doc
        'application/pdf', // pdf
        'image/tiff', // tiff
        'image/jpeg', // jpg, jpeg
        'image/png', // png
        'image/gif', // gif
      ],
    },
  },
});

export const getApiRoot = (): string => '/api';

// Get GraphQL API url
export const getGraphQLUrl = (): string => '/api';

// Get GraphQL Subscription url
export const getGraphQLSubscriptionUrl = (): string => {
  const { protocol, host } = window.location;

  return `${protocol === 'https:' ? 'wss' : 'ws'}://${host}/ws`;
};

// Get RSocket url
export const getRSocketUrl = (): string => {
  const { protocol, host } = window.location;

  return `${protocol === 'https:' ? 'wss' : 'ws'}://${host}/rsocket`;
};

// Get application version
export const getVersion = (): string => process.env.REACT_APP_VERSION || 'dev';

// Get brand config for chosen brand
export const getBrand = (): any => config.brand;

// Set current brand by brandId
export const setBrand = (brandId: any): void => {
  if (brandId) {
    config.brand = { id: brandId };
  } else {
    // Remove brand if provided brandId is undefined
    config.brand = undefined;
  }
};

// Get payment rejection reasons
export const getPaymentReason = (): any => config.brand?.payment?.reasons;

// Get available languages for brand
export const getAvailableLanguages = (): Array<string> => config.brand?.locales?.languages || [];

// Get backoffice brand
export const getBackofficeBrand = (): BackOfficeBrand => config.backofficeBrand;

// Set backoffice brand
export const setBackofficeBrand = (brandId: string): void => {
  config.backofficeBrand = {
    id: brandId,
  };
};

// Get static files url
export const getStaticFileUrl = (
  brand: string,
  file: string,
): string => `/cloud-static/brands/${brand}/backoffice/${file}`;

// Get current crm brand static files url
export const getCrmBrandStaticFileUrl = (
  file: string,
): string => `/cloud-static/crm-brands/${getBackofficeBrand().id}/${file}?${Math.random()}`;

export default config;
