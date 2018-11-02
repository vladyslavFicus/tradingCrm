import { I18n as reduxI18n } from 'react-redux-i18n';

const I18n = {
  t: (key, ...rest) => {
    try {
      return reduxI18n.t(key, ...rest);
    } catch (e) {
      console.warn(`${key} not found in translations.`);

      return key;
    }
  },
};

export default I18n;
