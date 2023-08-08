import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import classNames from 'classnames';
import { ShortLoader } from 'components';
import useRbacGrid from 'routes/RolesAndPermissions/hooks/useRbacGrid';
import PermissionsSetting from './components/PermissionsSetting';
import './RbacGrid.scss';

const RbacGrid = () => {
  const {
    authorities,
    loading,
    activeDepartment,
    activeRole,
    handleSelectAuthority,
  } = useRbacGrid();

  // ===== Renders ===== //
  const renderPermissionsSetting = useCallback(() => {
    if (!activeDepartment || !activeRole) {
      return (
        <div className="RbacGrid__no-authorities">
          {I18n.t('ROLES_AND_PERMISSIONS.CHOOSE_AN_AUTHORITY')}
        </div>
      );
    }

    return <PermissionsSetting department={activeDepartment} role={activeRole} />;
  }, [activeDepartment, activeRole]);

  return (
    <div className="RbacGrid">
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
