import fetch from './fetch';
import downloadBlob from './downloadBlob';

export default (type, endpoint, fileName) => async (dispatch, getState) => {
  const { auth: { logged } } = getState();

  if (!logged) {
    return dispatch({ type: type.FAILURE, error: true });
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'text/csv',
        'Content-Type': 'application/json',
      },
    });

    const blobData = await response.blob();
    downloadBlob(fileName, blobData);

    return dispatch({ type: type.SUCCESS });
  } catch (payload) {
    return dispatch({ type: type.FAILURE, error: true, payload });
  }
};
