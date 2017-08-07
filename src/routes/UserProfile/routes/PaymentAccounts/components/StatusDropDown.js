import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import {
  accountStatusActions,
  accountStatusColors,
  accountStatusLabels,
} from '../../../../../constants/payment';
import renderLabel from '../../../../../utils/renderLabel';

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
      <div className={classNames('font-weight-700', accountStatusColors[status])}>
        {renderLabel(status, accountStatusLabels)}
      </div>
    );

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
        <span onClick={this.toggle} className="cursor-pointer">
          {label}
        </span>
        <DropdownMenu>
          {
            accountStatusActions[status].map(item => (
              <DropdownItem
                onClick={() => onStatusChange(item.action)}
                className="text-uppercase"
                key={item.label}
              >
                <div className={'font-weight-700'}>
                  {I18n.t(item.label)}
                </div>
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default StatusDropDown;
