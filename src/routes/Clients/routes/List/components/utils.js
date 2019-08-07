import { get } from 'lodash';
import { deskTypes } from 'constants/hierarchyTypes';

/**
 * Get path to representative property in object
 * Returns object with assign and unassign path
 * e.g. - salesRep.uuid
 *
 * @param  {Object} client - casino Profile
 * @param  {ENUM: [SALES, RETENTION]} type - acquisition status
 * @param  {string} isMove - whether move action performed
 * @return {Object}
 */
const getUnassignedRepPath = (client, type, isMove) => {
  // when action type and acquisition status do not match
  // we set path to another status
  const oppositeRepPath = type === deskTypes.SALES
    ? `${deskTypes.RETENTION.toLowerCase()}Rep.uuid`
    : `${deskTypes.SALES.toLowerCase()}Rep.uuid`;

  if (isMove) {
    return {
      assignPath: `${type.toLowerCase()}Rep.uuid`,
      unassignPath: oppositeRepPath,
    };
  }

  // check whether client acquisition status equal to action type
  // yes - set opposite path
  // no - set normal path
  if (client.tradingProfile.aquisitionStatus !== type) {
    return { unassignPath: oppositeRepPath };
  }

  return { unassignPath: `${type.toLowerCase()}Rep.uuid` };
};

/**
 * Return object which will be passed to GQL to perform request
 *
 * @param  {Object[]} allClients - all clients which are loaded on the screen yet
 * @param  {string[]} touchedRowsIds - selected OR unselected row indexes
 * @param  {string} uuid - client id
 * @param  {number} index - index in {touchedRowsIds}
 * @param  {ENUM: [SALES, RETENTION]} type - acquisition status
 * @param  {boolean} isMoveAction - whether move action performed
 * @return {Object}
 */
const getClientUpdateObject = (allClients, touchedRowsIds, { uuid, index }, { type, isMoveAction }) => {
  // index in allClients array
  // if uuid - get index from touchedRowsIds, otherwise - take index from argument
  const sourcePath = uuid ? touchedRowsIds[index] : index;
  const { unassignPath, assignPath } = getUnassignedRepPath(allClients[sourcePath], type, isMoveAction);

  return {
    uuid: uuid || allClients[sourcePath].playerUUID,
    unassignFromOperator: get(allClients[sourcePath], `tradingProfile.${unassignPath}`) || null,
    ...(assignPath && get(allClients[sourcePath], `tradingProfile.${assignPath}`)
      && { assignToOperator: get(allClients[sourcePath], `tradingProfile.${assignPath}`) }
    ),
  };
};
/**
 * Returns array with objects and nulls to be passed to GQL request
 * nulls are needed for keeping correct indexes, they are filtered out at GQL side
 *
 * @param  {boolean} allRowsSelected - flag which shows if all checkbox active
 * @param  {string[]} touchedRowsIds - selected OR unselected row indexes
 * @param  {string[]|number[]} selectedRows - selected rows uuids OR indexes
 * @param  {number} totalElements - number of total clients on page
 * @param  {ENUM: [SALES, RETENTION]} type - acquisition status
 * @param  {boolean} isMoveAction - whether move action performed
 * @param  {Object} client - casino Profile
 * @return {Object[]}
 */
export const getClientsData = (
  { allRowsSelected, touchedRowsIds, selectedRows },
  totalElements,
  { type, isMoveAction },
  clients,
) => {
  let filteredArr = null;

  if (allRowsSelected) {
    // check whether number of selected clients on the screen is equal all possible clients on that page
    // and if there is no unselected client
    if (!touchedRowsIds.length && clients.length === totalElements) {
      // if move performed - we filter clients with the acquisition status which is equals to the move type
      // this is done to skip unnecessary call to API with this clients
      if (isMoveAction) {
        filteredArr = selectedRows.map(index => (
          clients[index].tradingProfile.aquisitionStatus !== type
            ? index
            : null
        ));
      }

      return (filteredArr || selectedRows)
        .map(index => (
          index || !Number.isNaN(index)
            ? getClientUpdateObject(clients, touchedRowsIds, { index }, { type, isMoveAction })
            : null
        ));
    }

    // if allRowsSelected and clients are not visible on page
    // return unselected client uuids
    return touchedRowsIds
      .map(index => ({ uuid: clients[index].playerUUID }));
  }

  // if allRowsSelected - false

  // same as at line 89
  if (isMoveAction) {
    filteredArr = selectedRows.map((uuid, index) => (
      clients[touchedRowsIds[index]].tradingProfile.aquisitionStatus !== type
        ? uuid
        : null
    ));
  }

  return (filteredArr || selectedRows)
    .map((uuid, index) => (
      uuid
        ? getClientUpdateObject(clients, touchedRowsIds, { uuid, index }, { type, isMoveAction })
        : null
    ));
};
