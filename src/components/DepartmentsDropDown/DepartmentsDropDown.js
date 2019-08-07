import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { departmentsLabels, rolesLabels } from '../../constants/operators';
import './DepartmentsDropDown.scss';

class DepartmentsDropDown extends Component {
  static propTypes = {
    authorities: PropTypes.arrayOf(PropTypes.authorityEntity).isRequired,
    current: PropTypes.authorityEntity,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    current: {},
  };

  state = {
    active: false,
  };

  handleToggleState = () => {
    this.setState(({ active }) => ({ active: !active }));
  };

  renderLabel = (entityValue, labels) => (entityValue && labels[entityValue]
    ? I18n.t(labels[entityValue])
    : entityValue);

  render() {
    const { active } = this.state;
    const {
      current,
      authorities,
      onChange,
    } = this.props;

    if (!current) {
      return null;
    }

    return (
      <Choose>
        <When condition={!authorities.length}>
          <div className="departments-dropdown-menu">
            <div className="departments-dropdown-menu__toggle">
              <div className="departments-dropdown-menu__department">
                {this.renderLabel(current.department, departmentsLabels)}
              </div>
              <div className="departments-dropdown-menu__role">
                {this.renderLabel(current.role, rolesLabels)}
              </div>
            </div>
          </div>
        </When>
        <Otherwise>
          <Dropdown className="departments-dropdown-menu" isOpen={active} toggle={this.handleToggleState}>
            <DropdownToggle
              className="departments-dropdown-menu__toggle"
              tag="button"
              id="department-toggle"
            >
              <div className="departments-dropdown-menu__department">
                {this.renderLabel(current.department, departmentsLabels)}
              </div>
              <div className="departments-dropdown-menu__role">
                {this.renderLabel(current.role, rolesLabels)}
              </div>
              <i className="fa fa-angle-down departments-dropdown-menu__caret" />
            </DropdownToggle>
            <DropdownMenu>
              {authorities.map(authority => (
                <DropdownItem key={authority.department} onClick={() => onChange(authority.department)}>
                  <div className="departments-dropdown-menu__item-department">
                    {this.renderLabel(authority.department, departmentsLabels)}
                  </div>
                  <div className="departments-dropdown-menu__role">
                    {this.renderLabel(authority.role, rolesLabels)}
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Otherwise>
      </Choose>
    );
  }
}

export default DepartmentsDropDown;
