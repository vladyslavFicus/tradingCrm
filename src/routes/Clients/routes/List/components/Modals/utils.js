/**
 * Check whether we can perform move action
 * We can't perform it, if any selected client doesn't have assigned {{type}} representative
 *
 * @param  {boolean} allRowsSelected - flag which shows if all checkbox active
 * @param  {string[]} touchedRowsIds - selected OR unselected row indexes
 * @param  {Object[]} content - all clients which are loaded on the screen yet
 * @param  {number} totalElements - number of total clients on page
 * @param  {ENUM: [SALES, RETENTION]} acquisitionStatus - acquisition status
 * @return {boolean}
 */
export const checkMovePermission = ({
  allRowsSelected,
  touchedRowsIds,
  content,
  totalElements,
  acquisitionStatus,
}) => {
  const type = acquisitionStatus.toLowerCase();

  if (allRowsSelected) {
    // check whether number of selected clients on the screen is equal all possible clients on that page
    // and if there is no unselected client
    if (!touchedRowsIds.length && content.length === totalElements) {
      return content.some(
        ({ acquisition: { [`${type}Representative`]: representative } }) => !(representative),
      );
    }

    // if allRowsSelected and clients are not visible on page
    // we return false and this will be checked on GQL side
    return false;
  }

  return touchedRowsIds.some((index) => {
    const representative = content[index].acquisition[`${type}Representative`];

    return !(representative);
  });
};
