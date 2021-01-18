import EventEmitter from 'events';

// ---- Client events ---- //
export const CLIENT_RELOAD = 'CLIENT_RELOAD';

// ---- Note events ---- //
export const NOTE_ADDED = 'NOTE_ADDED';
export const NOTE_UPDATED = 'NOTE_UPDATED';
export const NOTE_REMOVED = 'NOTE_REMOVED';

// ---- Lead events ---- //
export const LEAD_PROMOTED = 'LEAD_PROMOTED';

// ---- Operator events ---- //
export const OPERATOR_ACCOUNT_STATUS_CHANGED = 'OPERATOR_ACCOUNT_STATUS_CHANGED';

// ---- File events ---- //
export const FILE_UPLOADED = 'FILE_UPLOADED';
export const FILE_REMOVED = 'FILE_REMOVED';
export const FILE_CHANGED = 'FILE_CHANGED';

// ---- Acquisition status events ---- //
export const ACQUISITION_STATUS_CHANGED = 'ACQUISITION_STATUS_CHANGED';

// ---- Distribution rule events ---- //
export const DISTRIBUTION_RULE_CHANGED = 'DISTRIBUTION_RULE_CHANGED';

// ---- Notifications events ---- //
export const NOTIFICATION_CLICKED = 'NOTIFICATION_CLICKED';
export const NOTIFICATIONS_READ = 'NOTIFICATIONS_READ';

export default new EventEmitter();
