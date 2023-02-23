import React, { useState } from 'react';
import I18n from 'i18n-js';
import { HierarchyTreeBranch, HierarchyTreeUser } from '__generated__/types';
import { Link } from 'components/Link';
import CircleLoader from 'components/CircleLoader';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import { ReactComponent as CompanyIcon } from '../img/CompanyIcon.svg';
import { ReactComponent as BrandIcon } from '../img/BrandIcon.svg';
import { ReactComponent as OfficeIcon } from '../img/OfficeIcon.svg';
import { ReactComponent as DeskIcon } from '../img/DeskIcon.svg';
import { ReactComponent as TeamIcon } from '../img/TeamIcon.svg';
import { ReactComponent as PlusIcon } from '../img/PlusIcon.svg';
import { ReactComponent as MinusIcon } from '../img/MinusIcon.svg';
import { ReactComponent as OperatorIcon } from '../img/OperatorIcon.svg';
import HierarchyItemUser from '../HierarchyItemUser';
import { useTreeBranchQueryLazyQuery } from './graphql/__generated__/TreeBranchQuery';
import './HierarchyItemBranch.scss';

type Props = {
  branch: HierarchyTreeBranch,
};

const HierarchyItemBranch = (props: Props) => {
  const { branch } = props;

  const {
    uuid,
    name,
    brandId,
    branchType,
    childrenCount,
    usersCount,
  } = branch;

  const managers = branch.managers || [];

  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [children, setChildren] = useState<Array<HierarchyTreeBranch>>([]);
  const [users, setUsers] = useState<Array<HierarchyTreeUser>>([]);

  // ===== Requests ===== //
  const [treeBranchQuery] = useTreeBranchQueryLazyQuery({ variables: { uuid, brand: brandId } });

  const hasChildren = () => !!childrenCount || !!usersCount;

  // ===== Handlers ===== //
  const handleHideChildren = () => {
    setChildren([]);
    setUsers([]);
  };

  const handleExpandChildren = async () => {
    setLoading(true);
    const response = await treeBranchQuery();

    const branchChildren = response.data?.treeBranch?.children || [];
    const branchUsers = response.data?.treeBranch?.users || [];

    setChildren(branchChildren);
    setUsers(branchUsers);
    setLoading(false);
  };

  // ===== Renders ===== //
  const renderIcon = () => (
    <Choose>
      {/* Show loader if loading is true */}
      <When condition={loading}>
        <CircleLoader size={45} color="#4a90e2" className="HierarchyItemBranch__icon " />
      </When>

      {/* Show plus icon to expand or minus icon to hide branch children if children branches or users exists */}
      <When condition={hover && hasChildren()}>
        <Choose>
          <When condition={!children.length && !users.length}>
            <PlusIcon
              onClick={handleExpandChildren}
              className="HierarchyItemBranch__icon HierarchyItemBranch__link"
            />
          </When>

          <Otherwise>
            <MinusIcon
              onClick={handleHideChildren}
              className="HierarchyItemBranch__icon HierarchyItemBranch__link"
            />
          </Otherwise>
        </Choose>
      </When>

      {/* In other cases --> show branchType icon */}
      <When condition={branchType === 'COMPANY'}>
        <CompanyIcon className="HierarchyItemBranch__icon" />
      </When>

      <When condition={branchType === 'BRAND'}>
        <BrandIcon className="HierarchyItemBranch__icon" />
      </When>

      <When condition={branchType === 'OFFICE'}>
        <OfficeIcon className="HierarchyItemBranch__icon" />
      </When>

      <When condition={branchType === 'DESK'}>
        <DeskIcon className="HierarchyItemBranch__icon" />
      </When>

      <When condition={branchType === 'TEAM'}>
        <TeamIcon className="HierarchyItemBranch__icon" />
      </When>
    </Choose>
  );

  const renderTitle = () => (
    <Choose>
      {/* Exclude link for office and brand branch types (because we have no dedicated page for that) */}
      <When condition={['COMPANY', 'BRAND'].includes(branchType)}>
        <span className="HierarchyItemBranch__title">
          {name}
        </span>
      </When>

      <Otherwise>
        <Link
          to={`/${branchType.toLowerCase()}s/${uuid}`}
          target="_blank"
          className="HierarchyItemBranch__title HierarchyItemBranch__link"
        >
          {name}
        </Link>
      </Otherwise>
    </Choose>
  );

  return (
    <div className="HierarchyItemBranch">
      <div
        className="HierarchyItemBranch__content"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="HierarchyItemBranch__left-content">
          {renderIcon()}

          <div>
            {renderTitle()}

            <span className="HierarchyItemBranch__type">
              {I18n.t(`COMMON.${branchType}`)}
            </span>

            <div className="HierarchyItemBranch__description">
              {I18n.t('HIERARCHY.TREE.ITEM_DESCRIPTION', { childrenCount, usersCount })}
            </div>
          </div>
        </div>

        <div className="HierarchyItemBranch__manager">
          {I18n.t('HIERARCHY.TREE.MANAGER')}:&nbsp;

          <Choose>
            <When condition={!!managers.length}>
              {managers.map(manager => (
                <Link
                  to={`/operators/${manager.uuid}`}
                  target="_blank"
                  className="HierarchyItemBranch__manager-title HierarchyItemBranch__link"
                >
                  <OperatorIcon id={`manager-${manager.uuid}`} className="HierarchyItemBranch__manager-icon" />

                  <UncontrolledTooltip target={`manager-${manager.uuid}`} fade={false}>
                    {manager.fullName}
                  </UncontrolledTooltip>
                </Link>
              ))}
            </When>

            <Otherwise>
              {I18n.t('HIERARCHY.TREE.MANAGER_NOT_SELECTED')}
            </Otherwise>
          </Choose>
        </div>
      </div>

      <If condition={!!children.length || !!users.length}>
        <div className="HierarchyItemBranch__children">
          {children.map(item => (
            <HierarchyItemBranch
              key={item.uuid}
              branch={item}
            />
          ))}

          {users.map(item => (
            <HierarchyItemUser
              key={item.uuid}
              branchUUID={uuid}
              branchBrandId={brandId}
              user={item}
            />
          ))}
        </div>

        <div className="HierarchyItemBranch__separator" />
      </If>
    </div>
  );
};

export default React.memo(HierarchyItemBranch);
