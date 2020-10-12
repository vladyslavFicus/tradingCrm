import { get, isEmpty } from 'lodash';
import update from 'immutability-helper';

export default (data, location) => {
  let response = data ? { ...data } : null;
  const currentPage = get(response, 'number') || 0;

  if (response && !isEmpty(response.content)) {
    const { totalElements, content, size: responseSize } = response;
    const size = get(location, 'state.filters.searchLimit');

    if (size && totalElements >= size) {
      response = update(response, { totalElements: { $set: size } });

      if ((currentPage + 1) * responseSize >= size) {
        response = update(response, {
          content: { $splice: [[size, content.length]] },
          last: { $set: true },
        });
      }
    }
  }

  return {
    response,
    currentPage,
  };
};
