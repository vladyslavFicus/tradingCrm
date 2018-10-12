import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from '@newage/backoffice_ui';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { statusesColorNames, statuses, actionsColorNames, actions } from '../../constants';
import './StatusDropDown.scss';

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
      <div className={classNames('font-weight-700 status', statusesColorNames[status])}>
        {I18n.t(`route.conditionalTags.component.StatusDropDown.${status}`)}
        <i className="fa fa-angle-down" />
      </div>
    );

    if (status === statuses.DISABLED) {
      return label;
    }

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle} className="status-dropdown">
        <DropdownToggle
          tag="div"
          onClick={this.toggle}
          data-toggle="dropdown"
          aria-expanded={dropDownOpen}
          className="cursor-pointer"
        >
          {label}
        </DropdownToggle>
        <DropdownMenu>
          {Object.keys(actions).map(item => (
            <DropdownItem
              onClick={() => onStatusChange(item)}
              className={classNames('text-uppercase font-weight-700', actionsColorNames[item])}
              key={item}
            >
              {I18n.t(`route.conditionalTags.component.StatusDropDown.${item}`)}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default StatusDropDown;
