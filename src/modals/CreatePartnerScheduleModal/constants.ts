import { createValidator, translateLabels } from 'utils/validator';

export const attributeLabels = {
  country: 'PARTNERS.MODALS.SCHEDULE.LABELS.COUNTRY',
  workingHoursFrom: 'PARTNERS.MODALS.SCHEDULE.LABELS.WORKING_HOURS_FROM',
  workingHoursTo: 'PARTNERS.MODALS.SCHEDULE.LABELS.WORKING_HOURS_TO',
  leadsLimit: 'PARTNERS.MODALS.SCHEDULE.LABELS.LEADS_LIMIT',
  countryLimit: 'PARTNERS.MODALS.SCHEDULE.LABELS.COUNTRY_LIMIT',
};

export const validate = createValidator({
  workingHoursFrom: ['required', 'string', 'validTimeRange:workingHoursTo'],
  workingHoursTo: ['required', 'string'],
}, translateLabels(attributeLabels), false);
