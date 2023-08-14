import React, { useState, useCallback, useMemo } from 'react';

type Props = {
  children: React.ReactNode,
};

// Component props without 'onCloseModal' props that provided to component automatically
export type ComponentProps<TProps> = Omit<TProps, 'onCloseModal'> | undefined;

// Modal type in registry
type Modal<TProps> = {
  id: string,
  Component: React.FC<TProps>,
  componentProps: ComponentProps<TProps>,
};

// Type for context value
type Context = {
  show: <TProps>(
    id: string,
    Component: React.FC<TProps>,
    componentProps: ComponentProps<TProps>,
  ) => void,
  hide: (id: string) => void,
};

export const ModalContext = React.createContext<Context>({} as Context);

/**
 * Modal provider to render modals on the top of HTML tree
 * Uses modals like a whitelist. Only modals provided in registry will be rendered.
 *
 * @param props
 */
const ModalProvider = (props: Props) => {
  const [registry, setRegistry] = useState<Array<Modal<any>>>([]);

  /**
   * Show modal
   *
   * @param Component - Modal component before rendering
   * @param componentProps - Props object for modal to render
   *
   * @return id String - ID of modal in registry (need to hide modal in the future)
   */
  const show = useCallback(<TProps, >(
    id: string,
    Component: React.FC<TProps>,
    componentProps: ComponentProps<TProps>,
  ) => {
    const item: Modal<TProps> = {
      id,
      Component,
      componentProps,
    };

    setRegistry((_registry) => {
      // Skip adding existent modal to registry if modal already exists there
      const isModalExist = _registry.some(modal => modal.id === id);

      return isModalExist ? _registry : [..._registry, item];
    });
  }, []);

  /**
   * Hide modal by "id"
   *
   * @param id - Unique modal id in registry
   */
  const hide = useCallback((id: string) => {
    setRegistry(_registry => _registry.filter(({ id: _id }) => _id !== id));
  }, []);

  // Value for context provider
  const value = useMemo(() => ({
    show,
    hide,
  }), [show, hide]);

  return (
    <ModalContext.Provider value={value}>
      {/* Render all modals */}
      {registry.map(({ id, Component, componentProps }) => (
        <Component key={id} {...componentProps} onCloseModal={() => hide(id)} />
      ))}

      {props.children}
    </ModalContext.Provider>
  );
};

export default React.memo(ModalProvider);
