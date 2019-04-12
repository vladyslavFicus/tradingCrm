/**
 * Check whether we can perform move action
 * We can't perform it, if any selected client doesn't have assigned {{type}} representative
 *
 * @param  {boolean} allRowsSelected - flag which shows if all checkbox active
 * @param  {string[]} touchedRowsIds - selected OR unselected row indexes
 * @param  {Object[]} content - all clients which are loaded on the screen yet
 * @param  {number} totalElements - number of total clients on page
 * @param  {ENUM: [SALES, RETENTION]} aquisitionStatus - acquisition status
 * @return {boolean}
 */
export const checkMovePermission = ({
  allRowsSelected,
  touchedRowsIds,
  content,
  totalElements,
  aquisitionStatus,
}) => {
  const type = aquisitionStatus.toLowerCase();

  if (allRowsSelected) {
    // check whether number of selected clients on the screen is equal all possible clients on that page
    // and if there is no unselected client
    if (!touchedRowsIds.length && content.length === totalElements) {
      return content.some(
        ({ tradingProfile: { [`${type}Rep`]: representative } }) => !(representative && representative.uuid)
      );
    }

    // if allRowsSelected and clients are not visible on page
    // we return false and this will be checked on GQL side
    return false;
  }

  return touchedRowsIds.some((index) => {
    const rep = content[index].tradingProfile[`${type}Rep`];

    return !(rep && rep.uuid);
  });
};
