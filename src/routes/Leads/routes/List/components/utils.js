import { get } from 'lodash';

export const getLeadsData = ({ allRowsSelected, touchedRowsIds, selectedRows }, totalElements, leads) => {
  if (allRowsSelected) {
    if (!touchedRowsIds.length && leads.length === totalElements) {
      return selectedRows
        .map((_, index) => ({
          uuid: leads[index].id,
          unassignFromOperator: get(leads[index], 'salesAgent.uuid') || null,
        }));
    }

    return touchedRowsIds
      .map(index => ({ uuid: leads[index].id }));
  }

  return selectedRows
    .map((uuid, index) => ({
      uuid,
      unassignFromOperator: get(leads[touchedRowsIds[index]], 'salesAgent.uuid') || null,
    }));
};
