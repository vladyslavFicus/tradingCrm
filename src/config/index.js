import _ from 'lodash';
import backofficeBrands from '../brands';

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
  backofficeBrands,
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
 * Get application version
 *
 * @return {*}
 */
const getVersion = () => process.env.REACT_APP_VERSION || 'dev';

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
 * Get click to call credentials
 *
 * @return {any}
 */
const getClickToCall = () => config.brand?.clickToCall;

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
  config.backofficeBrand = config.backofficeBrands[brandId];

  // Set brand id to configuration for future usage
  if (config.backofficeBrand) {
    config.backofficeBrand.id = brandId;
  }

  // Dynamically import styles for brand if it's required
  if (typeof _.get(config.backofficeBrand, 'importStyle') === 'function') {
    config.backofficeBrand.importStyle();
  }
};

/**
 * Get static files url
 *
 * @return {string}
 */
const getStaticFileUrl = (brand, file) => `/cloud-static/brands/${brand}/backoffice/${file}`;

export {
  getApiRoot,
  getBrand,
  setBrand,
  getClickToCall,
  getAvailableLanguages,
  getVersion,
  getGraphQLUrl,
  getGraphQLSubscriptionUrl,
  getPaymentReason,
  getBackofficeBrand,
  setBackofficeBrand,
  getStaticFileUrl,
};

export default config;
