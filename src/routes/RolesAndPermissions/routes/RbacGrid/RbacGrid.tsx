import React, { useState } from 'react';
import I18n from 'i18n-js';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import classNames from 'classnames';
import Tabs from 'components/Tabs';
import ShortLoader from 'components/ShortLoader';
import { rbacTabs } from '../../constants';
import PermissionsSetting from './components/PermissionsSetting';
import { useAuthorityOptionsQuery } from './graphql/__generated__/AuthorityOptionsQuery';
import './RbacGrid.scss';

type Authorities = {
  [key: string]: Array<string>,
};

const RbacGrid = () => {
  const [activeDepartment, setActiveDepartment] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  // ===== Requests ===== //
  const { data, loading } = useAuthorityOptionsQuery();

  const authorities = data?.authoritiesOptions as Authorities || {};

  // ===== Handlers ===== //
  const handleSelectAuthority = (department: string, role: string) => {
    setActiveDepartment(department);
    setActiveRole(role);
  };

  // ===== Renders ===== //
  const renderPermissionsSetting = () => {
    if (!activeDepartment || !activeRole) {
      return (
        <div className="RbacGrid__no-authorities">
          {I18n.t('ROLES_AND_PERMISSIONS.CHOOSE_AN_AUTHORITY')}
        </div>
      );
    }

    return <PermissionsSetting department={activeDepartment} role={activeRole} />;
  };

  return (
    <div className="RbacGrid">
      <Tabs items={rbacTabs} className="RbacGrid__tabs" />

      <div className="RbacGrid__header">
        {I18n.t('ROLES_AND_PERMISSIONS.TITLE')}
      </div>

      <div className="RbacGrid__content">
        <Choose>
          <When condition={loading}>
            <ShortLoader />
          </When>

          <Otherwise>
            <div className="RbacGrid__authorities">
              <Accordion allowZeroExpanded>
                {Object.entries(authorities)
                  .filter(([department]) => department !== 'CASHIR')
                  .map(([department, roles]) => (
                    <AccordionItem key={department}>
                      <AccordionItemHeading>
                        <AccordionItemButton className="RbacGrid__authority-title">
                          {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${department}`)}
                        </AccordionItemButton>
                      </AccordionItemHeading>

                      {roles.map(role => (
                        <AccordionItemPanel
                          key={`${department}-${role}`}
                          onClick={() => handleSelectAuthority(department, role)}
                          className={classNames('RbacGrid__authority', {
                            'RbacGrid__authority--active':
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

            <div className="RbacGrid__permissions">
              {renderPermissionsSetting()}
            </div>
          </Otherwise>
        </Choose>
      </div>
    </div>
  );
};

export default React.memo(RbacGrid);
