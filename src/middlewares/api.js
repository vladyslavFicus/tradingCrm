import 'whatwg-fetch';
import { WEB_API, ContentType } from 'constants/index';
import { camelizeKeys } from 'humps';
import { actionCreators as authActionCreator } from 'redux/modules/auth';

const API_ROOT = 'http://moon.ua.newage.io/gateway/';

function buildUrl(url, parameters) {
  var queryString = '';
  for (let key in parameters) {
    var value = parameters[key];
    queryString += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
  }
  if (queryString.length > 0) {
    queryString = queryString.substring(0, queryString.length - 1);
    url = url + '?' + queryString;
  }
  return url;
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 304) {
    return response;
  } else {
    return parseJson(response)
      .then(prettifyResponse)
      .then(function (formattedResponse) {
        var error = new Error(formattedResponse.message || formattedResponse.errorDescription || response.statusText);
        if (formattedResponse.error) {
          error.code = formattedResponse.error;
        }
        error.response = response;

        return Promise.reject(error);
      });
  }
}

function parseJson(response) {
  return response.json().then(json => ({ json, response }));
}

function prettifyResponse({ json, response }) {
  return camelizeKeys(json);
}

function callApi(method = 'GET', type = ContentType.JSON, endpoint, params = {}, headers = {}) {
  let fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint;

  const options = {
    credentials: 'same-origin',
    method,
    headers: {
      Accept: ContentType.JSON,
      ...headers,
    },
  };

  if (method === 'POST') {
    if (type === ContentType.JSON) {
      options.headers['Content-Type'] = type;
      options.body = JSON.stringify(params);
    } else if (type === ContentType.FORM_DATA) {
      if (params) {
        var data = new FormData;
        for (let key in params) {
          data.append(key, params[key]);
        }

        options.body = data;
      }
    }
  } else {
    fullUrl = buildUrl(fullUrl, params)
  }

  return fetch(fullUrl, options)
    .then(checkStatus)
    .then(parseJson)
    .then(prettifyResponse);
}

export default store => next => action => {
  let payload = action[WEB_API];
  if (typeof payload === 'undefined') {
    return next(action);
  }

  let { method, type, endpoint, types, endpointParams, headers } = payload;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof method !== 'string') {
    throw new Error('Specify a request method.');
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }

  if (typeof endpointParams !== 'undefined') {
    if (typeof endpointParams !== 'object') {
      throw new Error('Expected an object of endpointParams.');
    }
  } else {
    endpointParams = {};
  }

  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }

  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  function actionWith(data) {
    const finalAction = { ...action, ...data };
    delete finalAction[WEB_API];
    return finalAction;
  }

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));

  return callApi(method, type, endpoint, endpointParams, headers).then(
    response => next(actionWith({
      response,
      type: successType,
    })),
    error => next(actionWith({
      type: failureType,
      error: error || { message: 'Something bad happened' },
    }))
  );
};
