import I18n from './i18n';

export default (entityValue, labels) => {
  return entityValue && labels[entityValue]
    ? I18n.t(labels[entityValue])
    : entityValue;
};
