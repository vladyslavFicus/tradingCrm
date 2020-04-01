import I18n from 'i18n-js';
import { getActiveBrandConfig } from 'config';

export const getSatelliteOptions = () => {
  const { satellites } = getActiveBrandConfig();

  if (!satellites || Object.keys(satellites).length === 0) return null;

  const satelliteOptions = Object.keys(satellites).map(satellite => ({
    label: satellite.charAt(0).toUpperCase() + satellite.slice(1),
    value: satellite.toUpperCase(),
  }));

  satelliteOptions.push({
    label: I18n.t('COMMON.NONE'),
    value: '',
  });

  return satelliteOptions;
};
