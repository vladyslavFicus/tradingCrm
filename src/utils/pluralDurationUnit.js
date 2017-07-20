import { durationUnits } from '../constants/user';

const durationUnitsList = {
  ru: {
    [durationUnits.YEARS]: 'год_года_лет',
    [durationUnits.MONTHS]: 'месяц_месяца_месяцев',
  },
  en: {
    [durationUnits.YEARS]: 'year_years_years',
    [durationUnits.MONTHS]: 'month_months_months',
  },
};

export default (amount, unit, locale = 'en') => {
  const defaultResult = `${amount} ${unit}`;

  const units = durationUnitsList[locale];
  if (!units) {
    return defaultResult;
  }
  const words = units[unit];
  if (!words) {
    return defaultResult;
  }

  const forms = words.split('_');
  if (forms.length !== 3) {
    return defaultResult;
  }

  let pluralForm = '';
  switch (true) {
    case (amount % 10 === 1 && amount % 100 !== 11):
      pluralForm = forms[0];
      break;
    case (amount % 10 >= 2 && amount % 10 <= 4 && (amount % 100 < 10 || amount % 100 >= 20)):
      pluralForm = forms[1];
      break;
    default:
      pluralForm = forms[2];
  }

  return `${amount} ${pluralForm}`;
};
