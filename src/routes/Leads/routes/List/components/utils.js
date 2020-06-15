import { get } from 'lodash';

export const getLeadsData = ({ touchedRowsIds }, content) => {
  const selectedContent = content.filter((_, i) => touchedRowsIds.includes(i));

  return selectedContent.map(item => ({
    uuid: item.uuid,
    unassignFromOperator: get(item, 'salesAgent.uuid') || null,
  }));
};
