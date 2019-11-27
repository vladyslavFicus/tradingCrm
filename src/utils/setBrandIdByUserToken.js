import jwtDecode from 'jwt-decode';
import { setBrandId, getBrandId } from '../config';

export default function setBrandIdByUserToken() {
  const storage = JSON.parse(window.localStorage.getItem('@storage'));

  if (storage && storage.token) {
    const tokenData = jwtDecode(storage.token);

    if (getBrandId() !== tokenData.brandId) {
      setBrandId(tokenData.brandId);
    }
  }
}
