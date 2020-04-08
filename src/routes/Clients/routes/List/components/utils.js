export const getClientsData = (
  { allRowsSelected, touchedRowsIds },
  totalElements,
  { type, isMoveAction },
  clients,
) => {
  let filteredArr = null;

  if (allRowsSelected && !(!touchedRowsIds.length && clients.length === totalElements)) {
    return touchedRowsIds.map(index => ({ uuid: clients[index].uuid }));
  }

  if (isMoveAction) {
    filteredArr = touchedRowsIds.filter(index => clients[index].acquisition.acquisitionStatus !== type);
  }

  return (filteredArr || touchedRowsIds)
    .map(index => (
      index || !Number.isNaN(index)
        ? {
          uuid: clients[index].uuid,
          salesRepresentative: clients[index].acquisition.salesRepresentative,
          retentionRepresentative: clients[index].acquisition.retentionRepresentative,
        }
        : null
    ));
};
