import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import {
  methodStatusActions, methodStatusesColor, methodsStatusesLabels,
} from '../../../../../constants/payment';

class StatusDropDown extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
  };

  state = {
    dropDownOpen: false,
  };

  toggle = () => {
    this.setState(({ dropDownOpen }) => ({
      dropDownOpen: !dropDownOpen,
    }));
  };

  render() {
    const { dropDownOpen } = this.state;
    const { status, readOnly } = this.props;

    const label = (
      <div className={classNames('font-weight-700', methodStatusesColor[status])}>
        {
          methodsStatusesLabels[status]
            ? I18n.t(methodsStatusesLabels[status])
            : status
        }
      </div>
    );

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
        <DropdownToggle
          tag="div"
          className="cursor-pointer"
        >
          {label}
        </DropdownToggle>
        <If condition={!readOnly}>
          <DropdownMenu>
            {methodStatusActions[status].map(item => (
              <DropdownItem
                onClick={() => this.props.onStatusChange(item.action)}
                className="text-uppercase font-weight-700"
                key={item.label}
              >
                {I18n.t(item.label)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </If>
      </Dropdown>
    );
  }
}

export default StatusDropDown;
