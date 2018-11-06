import moment from 'moment';
import I18n from '../../../utils/fake-i18n';

const today = moment();

const presets = [{
  text: I18n.t('DATE_PICKER.PERIOD_RESETS.PREVIOUS_WEEK'),
  start: moment().subtract(1, 'weeks').startOf('isoWeek'),
  end: moment().subtract(1, 'weeks').endOf('isoWeek'),
},
{
  text: I18n.t('DATE_PICKER.PERIOD_RESETS.THIS_WEEK'),
  start: moment().startOf('isoWeek'),
  end: moment().endOf('isoWeek'),
},
{
  text: I18n.t('DATE_PICKER.PERIOD_RESETS.PREVIOUS_MONTH'),
  start: moment().subtract(1, 'months').startOf('month'),
  end: moment().subtract(1, 'months').endOf('month'),
},
{
  text: I18n.t('DATE_PICKER.PERIOD_RESETS.THIS_MONTH'),
  start: moment().startOf('month'),
  end: moment().endOf('month'),
},
{
  text: I18n.t('DATE_PICKER.PERIOD_RESETS.LAST_7_DAYS'),
  start: moment().subtract(7, 'days'),
  end: today,
},
{
  text: I18n.t('DATE_PICKER.PERIOD_RESETS.LAST_14_DAYS'),
  start: moment().subtract(14, 'days'),
  end: today,
},
{
  text: I18n.t('DATE_PICKER.PERIOD_RESETS.THIS_YEAR'),
  start: moment().startOf('year'),
  end: moment().endOf('year'),
},
];

export {
  presets,
};
