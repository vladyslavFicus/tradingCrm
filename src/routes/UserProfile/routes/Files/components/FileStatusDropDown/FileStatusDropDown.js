import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from '../../../../../../constants/propTypes';
import { statusesLabels, statusActions, statusesColorNames } from '../../../../../../constants/files';

const initialState = {
  dropDownOpen: false,
};

class FileStatusDropDown extends Component {
  propTypes = {
    file: PropTypes.fileEntity.isRequired,
    onActionClick: PropTypes.func.isRequired,
  };

  state = { ...initialState };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  handleActionClick = (actionPayload) => {
    this.props.onActionClick(this.props.file, actionPayload.action);
  };

  renderStatus = status => (
    <div className={classNames('font-weight-700', statusesColorNames[status])}>
      {
        status && statusesLabels[status]
          ? statusesLabels[status]
          : status
      }
    </div>
  );

  render() {
    const { dropDownOpen } = this.state;
    const { file: { status } } = this.props;
    const availableStatuses = status && status.value
      ? statusActions[status.value]
      : [];

    const label = this.renderStatus(status.value);

    if (!availableStatuses.length) {
      return label;
    }

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle} onClick={this.toggle}>
        {label}

        <DropdownMenu>
          {
            availableStatuses.map(({ label: statusLabel, action, ...rest }) => (
              <DropdownItem
                key={rest.action}
                {...rest}
                onClick={this.handleActionClick.bind(this, action)}
              >
                {statusLabel}
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default FileStatusDropDown;
