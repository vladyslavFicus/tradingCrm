import { I18n } from 'react-redux-i18n';

const renderLabel = (entityValue, labels) => {
  return entityValue && labels[entityValue]
    ? I18n.t(labels[entityValue])
    : entityValue;
};

export {
  renderLabel,
};
