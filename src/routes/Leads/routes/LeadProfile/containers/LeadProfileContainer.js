import { graphql, compose } from 'react-apollo';
import { notesQuery } from 'graphql/queries/notes';
import {
  addNoteMutation,
  addPinnedNote,
  removeNote,
  removeNoteMutation,
  updateNoteMutation,
} from 'graphql/mutations/note';
import NoteModal from 'components/NoteModal';
import LeadProfile from '../components/LeadProfile';
import { withModals, withNotifications } from '../../../../../components/HighOrder';
import { leadProfileQuery } from '../../../../../graphql/queries/leads';
import { promoteLeadToClient } from '../../../../../graphql/mutations/leads';
import PromoteLeadModal from '../../../../../components/PromoteLeadModal';
import RepresentativeUpdateModal from '../../../../../components/RepresentativeUpdateModal';

const PINNED_NOTES_SIZE = 100;

export default compose(
  withNotifications,
  withModals({
    promoteLeadModal: PromoteLeadModal,
    noteModal: NoteModal,
    representativeModal: RepresentativeUpdateModal,
  }),
  graphql(promoteLeadToClient, {
    name: 'promoteLead',
  }),
  graphql(leadProfileQuery, {
    options: ({
      match: {
        params: {
          id: leadId,
        },
      },
    }) => ({
      variables: {
        leadId,
      },
      fetchPolicy: 'cache-and-network',
    }),
    name: 'leadProfile',
  }),
  graphql(notesQuery, {
    options: ({ match: { params: { id } } }) => ({
      variables: {
        size: PINNED_NOTES_SIZE,
        targetUUID: id,
        pinned: true,
      },
    }),
    name: 'pinnedNotes',
  }),
  graphql(addNoteMutation, {
    name: 'addNote',
    options: ({ match: { params: { id } }, location: { query } }) => ({
      refetchQueries: [{
        query: notesQuery,
        variables: {
          size: PINNED_NOTES_SIZE,
          targetUUID: id,
          pinned: true,
        },
      }, {
        query: notesQuery,
        variables: {
          targetUUID: id,
          size: 25,
          page: 0,
          ...query ? query.filters : {},
        },
      }],
    }),
  }),
  graphql(updateNoteMutation, {
    name: 'updateNote',
    options: ({ match: { params: { id } } }) => ({
      update: (proxy, {
        data: {
          note: {
            update: {
              data: {
                noteId,
                pinned,
                targetUUID,
              },
              data,
            },
          },
        },
      }) => {
        const {
          notes: {
            data: {
              content,
            },
          },
        } = proxy.readQuery({
          query: notesQuery,
          variables: {
            size: PINNED_NOTES_SIZE,
            targetUUID: id,
            pinned: true,
          },
        });

        const selectedNote = content.find(({ noteId: noteUUID }) => noteUUID === noteId);

        if (selectedNote && !pinned) {
          removeNote(proxy, { targetUUID, pinned: true, size: PINNED_NOTES_SIZE }, noteId);
        }

        if (!selectedNote && pinned) {
          addPinnedNote(proxy, { targetUUID, size: PINNED_NOTES_SIZE }, data);
        }
      },
    }),
  }),
  graphql(removeNoteMutation, {
    name: 'removeNote',
    options: ({ match: { params: { id } }, location: { query } }) => ({
      update: (proxy, {
        data: {
          note: {
            remove: {
              data: {
                noteId,
              },
            },
          },
        },
      }) => {
        removeNote(proxy, { targetUUID: id, pinned: true, size: PINNED_NOTES_SIZE }, noteId);
        removeNote(proxy, {
          targetUUID: id,
          size: 25,
          page: 0,
          ...query ? query.filters : {},
        }, noteId);
      },
    }),
  }),
)(LeadProfile);
