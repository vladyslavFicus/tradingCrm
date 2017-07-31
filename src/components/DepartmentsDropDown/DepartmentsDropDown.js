import React, { Component } from 'react';
import classNames from 'classnames';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { departmentsLabels, rolesLabels } from '../../constants/operators';
import './DepartmentsDropDown.scss';

class DepartmentsDropDown extends Component {
  static propTypes = {
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity).isRequired,
    current: PropTypes.authorityEntity,
    toggleId: PropTypes.string,
  };
  static defaultProps = {
    toggleId: 'department-toggle',
  };

  state = {
    active: false,
  };

  handleToggleState = () => {
    this.setState({ active: !this.state.active });
  };

  renderLabel = (entityValue, labels) => {
    return entityValue && labels[entityValue]
      ? I18n.t(labels[entityValue])
      : entityValue;
  };

  render() {
    const { active } = this.state;
    const { current, authorities } = this.props;

    if (!current) {
      return null;
    }

    const currentDepartmentNode = (
      <div className="department__current">
        {this.renderLabel(current.department, departmentsLabels)}
        {' '}
        <div className="role">
          {this.renderLabel(current.role, rolesLabels)}
        </div>
        {authorities.length > 0 && <i className={classNames('fa fa-angle-down', { 'arrow-up': active })} />}
      </div>
    );

    if (!authorities.length) {
      return currentDepartmentNode;
    }

    return (
      <Dropdown isOpen={active} toggle={this.handleToggleState}>
        <DropdownToggle className="dropdown-btn" id={this.props.toggleId}>
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
