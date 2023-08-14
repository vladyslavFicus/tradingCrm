import { useContext } from 'react';
import { LightboxContext } from './LightboxProvider';

const useLightbox = () => useContext(LightboxContext);

export default useLightbox;
