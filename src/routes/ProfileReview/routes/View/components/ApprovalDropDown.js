import React, { Component, PropTypes } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import RejectModal from './RejectModal';

class ApprovalDropDown extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleToggleModal = this.handleToggleModal.bind(this);
    this.handleReject = this.handleReject.bind(this);
    this.state = {
      opened: false,
      modalOpened: false,
    };
  }

  toggle() {
    this.setState({
      opened: !this.state.opened,
    });
  }

  handleToggleModal() {
    this.setState({
      modalOpened: !this.state.modalOpened,
    });
  }

  handleShowModal() {
    this.setState({
      modalOpened: true,
    });
  }

  handleHideModal(cb) {
    this.setState({
      modalOpened: false,
    }, cb);
  }

  handleReject({ reason }) {
    this.handleHideModal(() => this.props.onReject(reason));
  }

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

      <RejectModal
        show={modalOpened}
        onSubmit={this.handleReject}
        onToggle={this.handleToggleModal}
        onClose={this.handleHideModal}
      />
    </div>);
  }
}

ApprovalDropDown.propTypes = {};

export default ApprovalDropDown;
