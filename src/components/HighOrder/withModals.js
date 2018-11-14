import React, { Component, Fragment } from 'react';

function createWithModals(modals) {
  return function withModals(WrappedComponent) {
    return class Modals extends Component {
      constructor(props, context) {
        super(props, context);
        this.state = Object.keys(modals)
          .reduce((acc, curr) => ({ ...acc, [curr]: { isOpen: false, initial: true, data: {} } }), {});
      }

      get modalProps() {
        return Object.keys(modals)
          .reduce((acc, curr) => ({
            ...acc,
            [curr]: {
              show: modalData => this.handleOpen(curr, modalData),
              hide: () => this.handleClose(curr),
              isOpen: this.state[curr].isOpen,
            },
          }), {});
      }

      handleClose = (modal) => {
        this.setState({ [modal]: { ...this.state[modal], isOpen: false } });
      };

      handleOpen = (modal, modalData) => {
        this.setState({ [modal]: { isOpen: true, initial: false, data: modalData } });
      };

      render() {
        return (
          <Fragment>
            <WrappedComponent {...this.props} modals={this.modalProps} />
            <For of={Object.keys(modals)} each="modal">
              <If condition={this.state[modal].isOpen}>
                {React.createElement(modals[modal], {
                  ...this.state[modal].data,
                  key: modal,
                  isOpen: this.state[modal].isOpen,
                  onCloseModal: () => this.handleClose(modal),
                })}
              </If>
            </For>
          </Fragment>
        );
      }
    };
  };
}

export default createWithModals;
