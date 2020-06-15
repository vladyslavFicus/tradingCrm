import EventEmitter from 'events';

// ---- Profile events ---- //
export const PROFILE_RELOAD = 'PROFILE_RELOAD';

// ---- Note events ---- //
export const NOTE_ADDED = 'NOTE_ADDED';
export const NOTE_UPDATED = 'NOTE_UPDATED';
export const NOTE_REMOVED = 'NOTE_REMOVED';

// ---- Lead events ---- //
export const LEAD_PROMOTED = 'LEAD_PROMOTED';

// ---- File events ---- //
export const FILE_UPLOADED = 'FILE_UPLOADED';
export const FILE_REMOVED = 'FILE_REMOVED';

// ---- Acquisition status events ---- //
export const ACQUISITION_STATUS_CHANGED = 'ACQUISITION_STATUS_CHANGED';

export default new EventEmitter();
