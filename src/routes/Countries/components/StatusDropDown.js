import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { accessTypesActions, accessTypesColor, accessTypeLabels } from '../../../constants/countries';
import renderLabel from '../../../utils/renderLabel';

class StatusDropDown extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    onStatusChange: PropTypes.func.isRequired,
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
    const { status } = this.props;

    const label = (
      <div className={classNames('font-weight-700', accessTypesColor[status])}>
        { renderLabel(status, accessTypeLabels) }
      </div>
    );

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
        <DropdownToggle tag="div">
          {label}
        </DropdownToggle>
        <DropdownMenu>
          {accessTypesActions[status].map(item => (
            <DropdownItem
              onClick={() => this.props.onStatusChange(item.action)}
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
