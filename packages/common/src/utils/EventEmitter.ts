import EventEmitter from 'events';

// ---- Client events ---- //
export const CLIENT_RELOAD = 'CLIENT_RELOAD';
export const CREATE_CLIENT_CALLBACK = 'CREATE_CLIENT_CALLBACK';

// ---- Lead events ---- //
export const CREATE_LEAD_CALLBACK = 'CREATE_LEAD_CALLBACK';

// ---- Note events ---- //
export const NOTE_RELOAD = 'NOTE_RELOAD';

// ---- Notifications events ---- //
export const NOTIFICATION_CLICKED = 'NOTIFICATION_CLICKED';
export const NOTIFICATIONS_READ = 'NOTIFICATIONS_READ';

// ---- Filters toggler events ---- //
export const FILTERS_TOGGLER_COLLAPSED = 'FILTERS_TOGGLER_COLLAPSED';
export const FILTERS_TOGGLER_IN_VIEWPORT = 'FILTERS_TOGGLER_IN_VIEWPORT';

// ---- Trading engine events ---- //
export const ORDER_RELOAD = 'ORDER_RELOAD';
export const OPERATOR_RELOAD = 'OPERATOR_RELOAD';
export const TRANSACTION_CREATED = 'TRANSACTION_CREATED';

export default new EventEmitter();
