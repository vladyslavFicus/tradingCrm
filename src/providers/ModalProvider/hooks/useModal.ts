import React, { useContext, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import { ModalContext, ComponentProps } from '../ModalProvider';

/**
 * useModal hook to render modals in application
 *
 * Example:
 * const updateVersionModal = useModal(UpdateVersionModal);
 *
 * return (
 *   <button onClick={() => updateVersionModal.show({ title: 'My title' })}>
 * );
 *
 * @param Component
 */
export const useModal = <TProps>(Component: React.FC<TProps>) => {
  const modalProvider = useContext(ModalContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Generate unique ID
  const id = v4();

  // Return public API with 2 methods: "show" and "hide"
  return useMemo(
    () => ({
      show(props?: ComponentProps<TProps>) {
        modalProvider.show(id, Component, props);
        setIsOpen(true);
      },
      hide() {
        modalProvider.hide(id);
        setIsOpen(false);
      },
      isOpen,
    }),
    [id, isOpen, modalProvider, Component],
  );
};
