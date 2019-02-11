import { get } from 'lodash';

export const getClientsData = ({ allRowsSelected, touchedRowsIds, selectedRows }, totalElements, type, clients) => {
  if (allRowsSelected) {
    if (!touchedRowsIds.length && clients.length === totalElements) {
      return selectedRows
        .map((_, index) => ({
          uuid: clients[index].playerUUID,
          unassignFrom: get(clients[index], `tradingProfile.${type.toLowerCase()}Rep.uuid`) || null,
        }));
    }

    return touchedRowsIds
      .map(index => ({
        uuid: clients[index].playerUUID,
        unassignFrom: null,
      }));
  }

  return selectedRows
    .map((uuid, index) => ({
      uuid,
      unassignFrom: get(clients[touchedRowsIds[index]], `tradingProfile.${type.toLowerCase()}Rep.uuid`) || null,
    }));
};
