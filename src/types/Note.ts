import type { Placement } from '@popperjs/core';
import { Note } from '__generated__/types';

export type { Placement, Note };

export type EditNote = {
  subject: string,
  content: string,
  pinned: boolean,
  playerUUID: string,
  targetUUID: string,
  targetType: string,
};

export type NoteEntity = Note | null;

export type ManualNote = EditNote | null;

export type FormValues = {
  subject: string,
  content: string,
  pinned: boolean,
};
