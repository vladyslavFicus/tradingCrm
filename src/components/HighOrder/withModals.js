import React, { Component } from 'react';

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
            [curr]: { show: modalData => this.handleOpen(curr, modalData), hide: () => this.handleClose(curr) },
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
          <div>
            <WrappedComponent {...this.props} modals={this.modalProps} />
            <For of={Object.keys(modals)} each="modal">
              <If condition={!this.state[modal].initial}>
                {React.createElement(modals[modal], {
                  ...this.state[modal].data,
                  key: modal,
                  isOpen: this.state[modal].isOpen,
                  onCloseModal: () => this.handleClose(modal),
                })}
              </If>
            </For>
          </div>
        );
      }
    };
  };
}

export default createWithModals;
