import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import PropTypes from 'constants/propTypes';
import ShortLoader from 'components/ShortLoader';
import AuthorityOptionsQuery from './graphql/AuthorityOptionsQuery';
import PermissionsSetting from '../components/PermissionsSetting';
import './RolesAndPermissions.scss';
import 'react-accessible-accordion/dist/fancy-example.css';

class RolesAndPermissions extends PureComponent {
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
      <div className="RolesAndPermissions">
        <div className="RolesAndPermissions__header">
          <div className="RolesAndPermissions__title">{I18n.t('ROLES_AND_PERMISSIONS.TITLE')}</div>
        </div>
        <div className="RolesAndPermissions__content">
          <Choose>
            <When condition={authoritiesQuery.loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              <div className="RolesAndPermissions__authorities">
                <Accordion allowZeroExpanded>
                  <If condition={activeDepartment}>
                    <div className="RolesAndPermissions__current-authority">
                      {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${activeDepartment}`)}
                    </div>
                  </If>
                  {Object.entries(authorities).map(([department, roles]) => (
                    <AccordionItem key={department}>
                      <AccordionItemHeading>
                        <AccordionItemButton className="RolesAndPermissions__authority-title">
                          {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${department}`)}
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      {roles.map(role => (
                        <AccordionItemPanel
                          key={`${department}-${role}`}
                          onClick={() => this.handleSelectAuthority(department, role)}
                          className="RolesAndPermissions__authority cursor-pointer"
                        >
                          {I18n.t(`CONSTANTS.OPERATORS.ROLES.${role}`, { defaultValue: role })}
                        </AccordionItemPanel>
                      ))}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
              <div className="RolesAndPermissions__permissions">
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
})(RolesAndPermissions);
