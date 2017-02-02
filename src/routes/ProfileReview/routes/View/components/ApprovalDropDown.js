import React, { Component, PropTypes } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import RejectModal from './RejectModal';

class ApprovalDropDown extends Component {
  state = {
    opened: false,
    modalOpened: false,
  };

  toggle = () => {
    this.setState({
      opened: !this.state.opened,
    });
  };

  handleToggleModal = () => {
    this.setState({
      modalOpened: !this.state.modalOpened,
    });
  };

  handleShowModal = () => {
    this.setState({
      opened: false,
      modalOpened: true,
    });
  };

  handleHideModal = (cb) => {
    this.setState({
      modalOpened: false,
    }, () => cb());
  };

  handleReject = ({ reason }) => {
    this.handleHideModal(() => this.props.onReject(reason));
  };

  render() {
    const { onApprove } = this.props;
    const { modalOpened, opened } = this.state;

    return (<div>
      <ButtonDropdown isOpen={opened} toggle={this.toggle}>
        <DropdownToggle caret>
          Approval actions
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={onApprove}>Approve</DropdownItem>
          <DropdownItem onClick={this.handleShowModal}>Reject</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>

      {modalOpened && <RejectModal
        show={modalOpened}
        onSubmit={this.handleReject}
        onToggle={this.handleToggleModal}
        onClose={() => this.handleHideModal()}
      />}
    </div>);
  }
}

ApprovalDropDown.propTypes = {};

export default ApprovalDropDown;
