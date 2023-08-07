import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { HierarchyTreeUser } from '__generated__/types';
import capitalize from 'utils/capitalize';
import Link from 'components/Link';
import { UncontrolledTooltip } from 'components';
import useHierarchyItemUser from 'routes/Hierarchy/hooks/useHierarchyItemUser';
import { ReactComponent as OperatorIcon } from '../img/OperatorIcon.svg';
import './HierarchyItemUser.scss';

type Props = {
  branchUUID: string,
  branchBrandId: string,
  user: HierarchyTreeUser,
};

const HierarchyItemUser = (props: Props) => {
  const { branchBrandId, branchUUID, user } = props;
  const { uuid, operator } = user;

  const {
    authorities,
    authority,
  } = useHierarchyItemUser({ branchBrandId, user });

  return (
    <div className="HierarchyItemUser">
      <div className="HierarchyItemUser__content">
        <Link
          to={`/operators/${uuid}`}
          target="_blank"
        >
          <OperatorIcon
            className={classNames('HierarchyItemUser__icon', {
              'HierarchyItemUser__icon--danger': !operator,
            })}
          />
        </Link>

        <div>
          <Link
            to={`/operators/${uuid}`}
            target="_blank"
            className="HierarchyItemUser__title HierarchyItemUser__link"
          >
            {operator?.fullName || uuid}
          </Link>

          <If condition={!!operator}>
            <span className="HierarchyItemBranch__type">{I18n.t('HIERARCHY.TREE.OPERATOR')}</span>
          </If>

          <div className="HierarchyItemUser__description-wrapper">
            <If condition={!!authority}>
              <span id={`branch-${branchUUID}-${uuid}`} className="HierarchyItemUser__description">
                {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${authority.department}`, {
                  defaultValue: capitalize(authority.department),
                })}
                {' '}
                {I18n.t(`CONSTANTS.OPERATORS.ROLES.${authority.role}`, {
                  defaultValue: capitalize(authority.role),
                })}
              </span>
            </If>

            <If condition={authorities.length > 1}>
              <span className="HierarchyItemUser__dot" />

              <UncontrolledTooltip
                target={`branch-${branchUUID}-${uuid}`}
                placement="bottom"
                delay={{ show: 100, hide: 100 }}
                fade={false}
              >
                {authorities.map(item => (
                  <div
                    key={`${item.department}-${item.role}`}
                    className="HierarchyItemUser__authority-item"
                  >
                    {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${item.department}`, {
                      defaultValue: capitalize(item.department),
                    })}
                    {' '}
                    {I18n.t(`CONSTANTS.OPERATORS.ROLES.${item.role}`, {
                      defaultValue: capitalize(item.role),
                    })}

                    <br />
                  </div>
                ))}
              </UncontrolledTooltip>
            </If>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HierarchyItemUser);
