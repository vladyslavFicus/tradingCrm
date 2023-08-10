import { useContext } from 'react';
import { StorageContext } from '../StorageProvider';

/**
 * Get storage object from context
 */
export default () => useContext(StorageContext);
