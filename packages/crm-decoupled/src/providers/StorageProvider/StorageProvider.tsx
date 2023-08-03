import React from 'react';
import storage from './Storage';

/**
 * Available storage keys
 * - token
 * - auth: { Auth }
 *   -- role
 *   -- department
 *   -- uuid
 * - brand: { Brand }
 *   -- id
 *   -- authorities
 * - locale
 * - clientVersion
 * - isOldClientsGridFilterPanel
 * - clientsGridFilterFields
 * - lastOpenedAccountUuid
 * - lastCreatedOrderId
 * - debug
 */

type Props = {
  children: React.ReactNode,
};

export const StorageContext = React.createContext<typeof storage>(storage);

/**
 * Storage provider to help save data in different data storages
 */
const StorageProvider = (props: Props) => (
  <StorageContext.Provider value={storage}>
    {props.children}
  </StorageContext.Provider>
);

export default React.memo(StorageProvider);
