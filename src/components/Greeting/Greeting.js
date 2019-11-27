import I18n from 'i18n-js';
import getTimeOfDay from '../../utils/getTimeOfDay';

const Greeting = () => (
  getTimeOfDay([
    I18n.t('COMMON.GOOD_MORNING'),
    I18n.t('COMMON.GOOD_AFTERNOON'),
    I18n.t('COMMON.GOOD_EVENING'),
    I18n.t('COMMON.GOOD_NIGHT'),
  ])
);

export default Greeting;
