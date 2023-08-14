import ConfigProvider from './ConfigProvider';
import LightboxProvider, { useLightbox } from './LightboxProvider';
import CrmBrandProvider from './CrmBrandProvider';

import StorageProvider from './StorageProvider';
import useStorage from './StorageProvider/hooks/useStorage';
import useStorageState from './StorageProvider/hooks/useStorageState';
import { Auth, Brand } from './StorageProvider/types';

import LocaleProvider from './LocaleProvider';

import ModalProvider, { useModal } from './ModalProvider';

import NotificationProvider from './NotificationProvider';
import notify from './NotificationProvider/notify';
import { LevelType } from './NotificationProvider/types';

import TrackifyProvider from './TrackifyProvider';

import PermissionProvider, { usePermission, MockedPermissionProvider } from './PermissionsProvider';

import AutoLogoutProvider from './AutoLogoutProvider';

export {
  ConfigProvider,
  LightboxProvider,
  CrmBrandProvider,
  StorageProvider,
  useStorage,
  useStorageState,
  LocaleProvider,
  ModalProvider,
  useModal,
  NotificationProvider,
  notify,
  TrackifyProvider,
  PermissionProvider,
  usePermission,
  MockedPermissionProvider,
  AutoLogoutProvider,
  useLightbox,
  LevelType,
};
export type {
  Auth, Brand,
};
