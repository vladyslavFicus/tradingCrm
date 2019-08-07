import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import Uuid from '../Uuid';
import {
  statuses,
  statusActions,
  statusesColorNames,
  statusesLabels,
  actionsColorNames,
} from '../../constants/files';
import renderLabel from '../../utils/renderLabel';

class FileStatusDropDown extends Component {
  static propTypes = {
    status: PropTypes.object.isRequired,
    onStatusChange: PropTypes.func.isRequired,
  };

  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
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
    const { status, onStatusChange } = this.props;
    const { permissions: currentPermissions } = this.context;
    const actions = statusActions[status.value]
      .filter(i => i && (i.permissions === undefined || i.permissions.check(currentPermissions)));

    const label = (
      <div>
        <div className={classNames('font-weight-700 status', statusesColorNames[status.value])}>
          {renderLabel(status.value, statusesLabels)}
          <i className="fa fa-angle-down" />
        </div>
        {
          status.value !== statuses.PENDING
          && (
            <div className="font-size-11">
              {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={status.author} />
            </div>
          )
        }
      </div>
    );

    if (actions.length === 0) {
      return label;
    }

    return (
      <Dropdown isOpen={dropDownOpen} toggle={this.toggle} className="status-dropdown">
        <DropdownToggle
          tag="div"
          className="cursor-pointer"
        >
          {label}
        </DropdownToggle>
        <DropdownMenu>
          {actions.map(item => (
            <DropdownItem
              onClick={() => onStatusChange(item.action)}
              className={classNames('text-uppercase font-weight-700', actionsColorNames[item.action])}
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

export default FileStatusDropDown;
