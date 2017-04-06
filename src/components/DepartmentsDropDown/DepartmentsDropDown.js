import React, { Component } from 'react';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from '../../constants/propTypes';
import { departmentsLabels, rolesLabels } from '../../constants/operators';
import './DepartmentsDropDown.scss';

class DepartmentsDropDown extends Component {
  static propTypes = {
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity).isRequired,
    current: PropTypes.authorityEntity,
  };

  state = {
    active: false,
  };

  handleToggleState = () => {
    this.setState({ active: !this.state.active });
  };

  renderLabel = (entityValue, labels) => {
    return entityValue && labels[entityValue]
      ? labels[entityValue]
      : entityValue;
  };

  render() {
    const { active } = this.state;
    const { current, authorities } = this.props;

    if (!current) {
      return null;
    }

    const currentDepartmentNode = (
      <div>
        {this.renderLabel(current.department, departmentsLabels)}
        {' '}
        {authorities.length > 0 && <i className={classNames('fa fa-angle-down', { 'arrow-up': active })} />}
        <div className="role">
          {this.renderLabel(current.role, rolesLabels)}
        </div>
      </div>
    );

    if (!authorities.length) {
      return currentDepartmentNode;
    }

    return (
      <Dropdown isOpen={active} toggle={this.handleToggleState}>
        <DropdownToggle className="dropdown-btn">
          {currentDepartmentNode}
        </DropdownToggle>
        <DropdownMenu>
          {authorities.map(authority => (
            <DropdownItem key={authority.department} onClick={() => this.props.onChange(authority.department)}>
              <div>{this.renderLabel(authority.department, departmentsLabels)}</div>
              <span className="role">
                {this.renderLabel(authority.role, rolesLabels)}
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default DepartmentsDropDown;
