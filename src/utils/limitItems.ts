import { get, isEmpty } from 'lodash';
import update from 'immutability-helper';
import { Pageable } from 'types';

export default <T>(data: Pageable<T>, location: Object) => {
  let response = data ? { ...data } : {} as Pageable<T>;
  const currentPage = response.number || 0;

  if (!isEmpty(response.content)) {
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
