import { useContext } from 'react';
import { RSocketContext } from '../providers/RSocketProvider';

const useRsocket = () => useContext(RSocketContext);

export default useRsocket;
