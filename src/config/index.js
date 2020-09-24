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
}, (window.nas || {}));

function getApiRoot() {
  return '/api';
}

function getApiVersion() {
  return config.version;
}

function getAvailableLanguages() {
  return _.get(window, 'app.brand.locales.languages', []);
}

function getGraphQLRoot() {
  return config.graphqlRoot;
}

function getActiveBrandConfig() {
  return _.get(window, 'app.brand');
}

function getBrand() {
  return _.get(window, 'app.brand');
}

function getBrandId() {
  return _.get(window, 'app.brandId');
}

function getEnvironment() {
  return _.get(window, 'nas.environment');
}

function getPaymentReason() {
  return _.get(window, 'app.brand.payment.reasons');
}

function getClickToCall() {
  return _.get(window, 'app.brand.clickToCall');
}

function setBrandId(brandId) {
  window.app.brandId = brandId;
  window.app.brand = config.brands[brandId];
}

function removeActiveBrand() {
  window.app.brand = undefined;
  window.app.brandId = undefined;
}

function getLogo() {
  return `/img/brand/header/${getBrandId()}.svg`;
}

function getVersion() {
  return config.version;
}

function getDomain() {
  if (window && window.location) {
    const { protocol, hostname, port } = window.location;

    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }

  return '';
}

function getBackofficeBrand() {
  return config.backofficeBrand;
}

function setBackofficeBrand(brandId) {
  config.backofficeBrand = config.backofficeBrands[brandId];

  // Set brand id to configuration for future usage
  if (config.backofficeBrand) {
    config.backofficeBrand.id = brandId;
  }

  // Dynamically import styles for brand if it's required
  if (typeof _.get(config.backofficeBrand, 'importStyle') === 'function') {
    config.backofficeBrand.importStyle();
  }
}

/**
 * Get static files url
 *
 * @return {string}
 */
const getStaticFileUrl = (brand, file) => `/cloud-static/${brand}/backoffice/${file}`;

export {
  getApiRoot,
  getBrand,
  getBrandId,
  setBrandId,
  getClickToCall,
  removeActiveBrand,
  getEnvironment,
  getLogo,
  getActiveBrandConfig,
  getAvailableLanguages,
  getVersion,
  getApiVersion,
  getDomain,
  getGraphQLRoot,
  getPaymentReason,
  getBackofficeBrand,
  setBackofficeBrand,
  getStaticFileUrl,
};

export default config;
