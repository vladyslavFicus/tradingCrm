import I18n from 'i18n-js';

const Greeting = () => {
  const hour = new Date().getHours();

  if (hour > 23 || hour < 4) {
    return I18n.t('COMMON.GOOD_NIGHT');
  } if (hour > 3 && hour < 12) {
    return I18n.t('COMMON.GOOD_MORNING');
  } if (hour > 11 && hour < 17) {
    return I18n.t('COMMON.GOOD_AFTERNOON');
  }

  return I18n.t('COMMON.GOOD_EVENING');
};

export default Greeting;
