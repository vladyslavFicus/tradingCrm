import { get, isEmpty } from 'lodash';
import update from 'immutability-helper';

export default (data, location) => {
  let response = data ? { ...data } : null;
  const currentPage = get(response, 'number') || 0;

  if (response && !isEmpty(response.data)) {
    const { totalElements, content, size: responseSize } = response.data;
    const size = get(location, 'query.filters.size');

    if (size && totalElements >= size) {
      response = update(response, { data: { totalElements: { $set: size } } });

      if ((currentPage + 1) * responseSize >= size) {
        response = update(response, {
          data: {
            content: { $splice: [[size, content.length]] },
            last: { $set: true },
          },
        });
      }
    }
  }

  return {
    response,
    currentPage,
  };
};
