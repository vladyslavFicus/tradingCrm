import React, { Component } from 'react';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from '../../constants/propTypes';
import './DepartmentsDropDown.scss';

class DepartmentsDropDown extends Component {
  static propTypes = {
    departments: PropTypes.arrayOf(PropTypes.departmentItem).isRequired,
    current: PropTypes.departmentItem,
  };

  state = {
    active: false,
  };

  handleToggleState = () => {
    this.setState({ active: !this.state.active });
  };

  handleSelect = (department) => {
    console.log(`Selected: ${department.name}`);
  };

  render() {
    const { active } = this.state;
    const { current, departments } = this.props;

    const currentDepartmentNode = (
      <div>
        {current.name} <i className={classNames('fa fa-angle-down', { 'arrow-up': active })} />
        <div className="role">{current.role}</div>
      </div>
    );

    if (!departments.length) {
      return currentDepartmentNode;
    }

    return (
      <Dropdown isOpen={active} toggle={this.handleToggleState}>
        <DropdownToggle className="dropdown-btn">
          {currentDepartmentNode}
        </DropdownToggle>
        <DropdownMenu>
          {departments.map(department => (
            <DropdownItem key={department.name}>
              <div>{department.name}</div>
              <span className="role">
                {department.role}
              </span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default DepartmentsDropDown;
