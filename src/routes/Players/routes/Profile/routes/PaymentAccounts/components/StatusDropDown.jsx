import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import {
  accountStatusActions,
  accountStatusColors,
  accountStatusLabels,
} from '../../../../../../../constants/payment';
import renderLabel from '../../../../../../../utils/renderLabel';

class StatusDropDown extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    onStatusChange: PropTypes.func.isRequired,
  };

  state = {
    dropDownOpen: false,
  };

  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  render() {
    const { dropDownOpen } = this.state;
    const { status, onStatusChange } = this.props;

    const label = (
      <div className={classNames('font-weight-700 status', accountStatusColors[status])}>
        {renderLabel(status, accountStatusLabels)}
        <i className="fa fa-angle-down" />
      </div>
    );

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle} className="status-dropdown">
        <DropdownToggle
          tag="div"
          onClick={this.toggle}
          data-toggle="dropdown"
          aria-expanded={dropDownOpen}
        >
          {label}
        </DropdownToggle>
        <DropdownMenu>
          {accountStatusActions[status].map(item => (
            <DropdownItem
              onClick={() => onStatusChange(item.action)}
              className="text-uppercase font-weight-700"
              key={item.label}
            >
              {I18n.t(item.label)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default StatusDropDown;
