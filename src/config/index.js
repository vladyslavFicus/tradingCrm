import _ from 'lodash';

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

function getApiRoot() {
  return '/api';
}

/**
 * Get GraphQL API url
 *
 * @return {*}
 */
const getGraphQLUrl = () => '/api';

/**
 * Get GraphQL Subscription url
 *
 * @return {*}
 */
const getGraphQLSubscriptionUrl = () => {
  const { protocol, host } = window.location;

  return `${protocol === 'https:' ? 'wss' : 'ws'}://${host}/ws`;
};

/**
 * Get RSocket url
 *
 * @return {*}
 */
const getRSocketUrl = () => {
  const { protocol, host } = window.location;

  return `${protocol === 'https:' ? 'wss' : 'ws'}://${host}/rsocket`;
};

/**
 * Get application version
 *
 * @return {*}
 */
const getVersion = () => process.env.APP_VERSION || 'dev';

/**
 * Get brand config for chosen brand
 *
 * @return {any}
 */
const getBrand = () => config.brand;

/**
 * Set current brand by brandId
 *
 * @return {object | undefined }
 */
const setBrand = (brandId) => {
  if (brandId) {
    config.brand = { id: brandId };
  } else {
    // Remove brand if provided brandId is undefined
    config.brand = undefined;
  }
};

/**
 * Get payment rejection reasons
 *
 * @type {any}
 */
const getPaymentReason = () => config.brand?.payment?.reasons;

/**
 * Get available languages for brand
 *
 * @return {any}
 */
const getAvailableLanguages = () => config.brand?.locales?.languages || [];

/**
 * Get backoffice brand
 *
 * @return {*}
 */
const getBackofficeBrand = () => config.backofficeBrand;

/**
 * Set backoffice brand
 *
 * @param brandId
 */
const setBackofficeBrand = (brandId) => {
  config.backofficeBrand = {
    id: brandId,
  };
};

/**
 * Get static files url
 *
 * @return {string}
 */
const getStaticFileUrl = (brand, file) => `/cloud-static/brands/${brand}/backoffice/${file}`;

/**
 * Get current crm brand static files url
 *
 * @return {string}
 */
const getCrmBrandStaticFileUrl = file => `/cloud-static/crm-brands/${getBackofficeBrand().id}/${file}?${Math.random()}`;

export {
  getApiRoot,
  getBrand,
  setBrand,
  getAvailableLanguages,
  getVersion,
  getGraphQLUrl,
  getGraphQLSubscriptionUrl,
  getPaymentReason,
  getBackofficeBrand,
  setBackofficeBrand,
  getStaticFileUrl,
  getCrmBrandStaticFileUrl,
  getRSocketUrl,
};

export default config;
