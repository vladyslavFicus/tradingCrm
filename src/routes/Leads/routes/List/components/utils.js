import { get } from 'lodash';

export const getLeadsData = ({ allRowsSelected, touchedRowsIds, selectedRows }, totalElements, leads) => {
  if (allRowsSelected) {
    if (!touchedRowsIds.length && leads.length === totalElements) {
      return selectedRows
        .map((_, index) => ({
          uuid: leads[index].uuid,
          unassignFromOperator: get(leads[index], 'salesAgent.uuid') || null,
        }));
    }

    return touchedRowsIds
      .map(index => ({ uuid: leads[index].uuid }));
  }

  return selectedRows
    .map((uuid, index) => ({
      uuid,
      unassignFromOperator: get(leads[touchedRowsIds[index]], 'salesAgent.uuid') || null,
    }));
};
