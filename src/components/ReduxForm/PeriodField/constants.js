import keyMirror from 'keymirror';
import I18n from '../../../utils/fake-i18n';

const periods = keyMirror({
  HOURS: null,
  DAYS: null,
  WEEKS: null,
});

const periodLabels = {
  [periods.HOURS]: I18n.t('COMMON.HOURS'),
  [periods.DAYS]: I18n.t('COMMON.DAYS'),
  [periods.WEEKS]: I18n.t('COMMON.WEEKS'),
};

const range = {
  [periods.HOURS]: 3600,
  [periods.DAYS]: 86400,
  [periods.WEEKS]: 604800,
};

export {
  periods,
  periodLabels,
  range,
};
