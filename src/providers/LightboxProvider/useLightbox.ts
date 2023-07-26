import { useContext } from 'react';
import { LightboxContext } from './LightboxProvider';

export const useLightbox = () => useContext(LightboxContext);
