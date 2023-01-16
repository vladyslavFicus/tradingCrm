import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import { withPermission } from 'providers/PermissionsProvider';
import Permissions from 'utils/permissions';
import DropDown from 'components/DropDown';
import './ActionsDropDown.scss';

class ActionsDropDown extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
    })).isRequired,
    permission: PropTypes.shape({
      permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: null,
  };

  render() {
    const {
      items,
      className,
      permission: { permissions: currentPermissions },
    } = this.props;

    const visibleItems = items.filter((item) => {
      const isValidPermission = !(item.permissions instanceof Permissions)
        || item.permissions.check(currentPermissions);

      return (item.visible === undefined || item.visible) && isValidPermission;
    });

    if (!visibleItems.length) {
      return null;
    }

    return (
      <DropDown
        className={classNames('ActionDropDown', className)}
        toggleClassName="ActionDropDown__toggle"
        withArrow
        rightPlacement
      >
        <DropdownMenu container="body">
          {visibleItems.map(item => (
            <DropdownItem
              id={item.id}
              key={item.label}
              onClick={item.onClick}
            >
              {item.label}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </DropDown>
    );
  }
}

export default withPermission(ActionsDropDown);
