import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import classNames from 'classnames';
import { withRequests } from 'apollo';
import Tabs from 'components/Tabs';
import PropTypes from 'constants/propTypes';
import ShortLoader from 'components/ShortLoader';
import { RbacTabs } from '../../constants';
import PermissionsSetting from './components/PermissionsSetting';
import AuthorityOptionsQuery from './graphql/AuthorityOptionsQuery';
import './RolesAndPermissionsTab.scss';

class RolesAndPermissionsTab extends PureComponent {
  static propTypes = {
    authoritiesQuery: PropTypes.query({
      authoritiesOptions: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
    }).isRequired,
  };

  state = {
    department: null,
    role: null,
  };

  /**
   * Handle select authority to show actions
   *
   * @param department
   * @param role
   */
  handleSelectAuthority = (department, role) => {
    this.setState({ department, role });
  };

  render() {
    const { authoritiesQuery } = this.props;
    const { department: activeDepartment, role: activeRole } = this.state;
    const authorities = authoritiesQuery.data?.authoritiesOptions || {};

    return (
      <div className="RolesAndPermissionsTab">
        <Tabs items={RbacTabs} className="RolesAndPermissionsTab__tabs" />

        <div className="RolesAndPermissionsTab__header">
          <div className="RolesAndPermissionsTab__title">{I18n.t('ROLES_AND_PERMISSIONS.TITLE')}</div>
        </div>
        <div className="RolesAndPermissionsTab__content">
          <Choose>
            <When condition={authoritiesQuery.loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              <div className="RolesAndPermissionsTab__authorities">
                <Accordion allowZeroExpanded>
                  {Object.entries(authorities)
                    .filter(([department]) => department !== 'CASHIR')
                    .map(([department, roles]) => (
                      <AccordionItem key={department}>
                        <AccordionItemHeading>
                          <AccordionItemButton className="RolesAndPermissionsTab__authority-title">
                            {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${department}`)}
                          </AccordionItemButton>
                        </AccordionItemHeading>
                        {roles.map(role => (
                          <AccordionItemPanel
                            key={`${department}-${role}`}
                            onClick={() => this.handleSelectAuthority(department, role)}
                            className={classNames('RolesAndPermissionsTab__authority', {
                              'RolesAndPermissionsTab__authority--active':
                                department === activeDepartment && role === activeRole,
                            })}
                          >
                            {I18n.t(`CONSTANTS.OPERATORS.ROLES.${role}`, { defaultValue: role })}
                          </AccordionItemPanel>
                        ))}
                      </AccordionItem>
                    ))
                  }
                </Accordion>
              </div>
              <div className="RolesAndPermissionsTab__permissions">
                <PermissionsSetting department={activeDepartment} role={activeRole} />
              </div>
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  }
}

export default withRequests({
  authoritiesQuery: AuthorityOptionsQuery,
})(RolesAndPermissionsTab);
