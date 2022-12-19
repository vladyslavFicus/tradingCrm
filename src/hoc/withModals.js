import React, { PureComponent, Fragment } from 'react';
import Transition from 'react-transition-group/Transition';

const DEFAULT_MODAL_TIMEOUT = 100;

export default modals => WrappedComponent => class Modals extends PureComponent {
  state = Object.keys(modals).reduce((acc, curr) => ({ ...acc, [curr]: { isOpen: false, data: {} } }), {});

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

  handleOpen = (modal, modalData) => this.setState({ [modal]: { isOpen: true, data: modalData } });

  handleClose = modal => this.setState(state => ({ [modal]: { ...state[modal], isOpen: false } }));

  render() {
    return (
      <Fragment>
        <WrappedComponent {...this.props} modals={this.modalProps} />
        {Object.keys(modals).map(modal => (
          <Transition
            mountOnEnter
            unmountOnExit
            key={modal}
            in={this.state[modal].isOpen}
            timeout={this.state[modal].timeout || DEFAULT_MODAL_TIMEOUT}
          >
            {() => React.createElement(modals[modal], {
              ...this.state[modal].data,
              isOpen: this.state[modal].isOpen,
              onCloseModal: () => this.handleClose(modal),
            })}
          </Transition>
        ))}
      </Fragment>
    );
  }
};
