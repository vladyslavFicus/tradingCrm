import jwtDecode from 'jwt-decode';
import { setBrandId, getBrandId } from '../config';

export default function setBrandIdByUserToken() {
  const storageJSON = window.localStorage.getItem('@storage');
  const storage = storageJSON && JSON.parse(storageJSON);

  if (storage && storage.token) {
    const tokenData = jwtDecode(storage.token);

    if (getBrandId() !== tokenData.brandId) {
      setBrandId(tokenData.brandId);
    }
  }
}
