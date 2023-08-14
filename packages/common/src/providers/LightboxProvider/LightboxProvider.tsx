import React, { useState } from 'react';
import Lightbox from './components/Lightbox';

export type ContextType = {
  show: (src: string) => void,
};

export const LightboxContext = React.createContext({} as ContextType);

type Props = {
  children: React.ReactNode,
};

const LightboxProvider = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState('');

  const show = (src: string) => {
    document.body.style.overflow = 'hidden';
    setOpen(true);
    setSource(src);
  };

  const hide = () => {
    document.body.style.overflow = '';
    setOpen(false);
    setSource('');
  };

  return (
    <LightboxContext.Provider value={{ show }}>
      <If condition={open}>
        <Lightbox source={source} onHide={hide} />
      </If>

      {props.children}
    </LightboxContext.Provider>
  );
};

export default React.memo(LightboxProvider);
