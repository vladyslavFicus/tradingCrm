import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withApollo, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import I18n from 'i18n-js';
import CircleLoader from 'components/CircleLoader';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import { ReactComponent as CompanyIcon } from './img/CompanyIcon.svg';
import { ReactComponent as BrandIcon } from './img/BrandIcon.svg';
import { ReactComponent as OfficeIcon } from './img/OfficeIcon.svg';
import { ReactComponent as DeskIcon } from './img/DeskIcon.svg';
import { ReactComponent as TeamIcon } from './img/TeamIcon.svg';
import { ReactComponent as PlusIcon } from './img/PlusIcon.svg';
import { ReactComponent as MinusIcon } from './img/MinusIcon.svg';
import { ReactComponent as OperatorIcon } from './img/OperatorIcon.svg';
import { REQUEST as TreeBranchQuery } from './graphql/TreeBranchQuery';
import HierarchyItemUser from './HierarchyItemUser';
import './HierarchyItemBranch.scss';

class HierarchyItemBranch extends PureComponent {
  static propTypes = {
    client: PropTypes.object.isRequired, // Apollo Client

    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    brandId: PropTypes.string.isRequired,
    branchType: PropTypes.string.isRequired,
    childrenCount: PropTypes.number,
    usersCount: PropTypes.number,
    manager: PropTypes.shape({
      uuid: PropTypes.string,
      fullName: PropTypes,
    }),
  };

  static defaultProps = {
    childrenCount: 0,
    usersCount: 0,
    manager: null,
  };

  state = {
    loading: false,
    isMouseEnter: false,
    children: [],
    users: [],
  };

  hasChildren = () => !!this.props.childrenCount || !!this.props.usersCount;

  handleHideChildren = () => {
    this.setState({ children: [], users: [] });
  };

  handleExpandChildren = async () => {
    const { client, uuid } = this.props;

    this.setState({ loading: true });

    const response = await client.query({
      query: TreeBranchQuery,
      variables: { uuid },
    });

    const children = response.data?.treeBranch?.children || [];
    const users = response.data?.treeBranch?.users || [];

    this.setState({ loading: false, children, users });
  };

  handleMouseEvent = isMouseEnter => () => {
    this.setState({ isMouseEnter });
  };

  renderIcon() {
    const { branchType } = this.props;
    const { loading, isMouseEnter, children, users } = this.state;

    return (
      <Choose>
        {/* Show loader if loading is true */}
        <When condition={loading}>
          <CircleLoader size={45} color="#4a90e2" className="HierarchyItemBranch__icon " />
        </When>

        {/* Show plus icon to expand or minus icon to hide branch children if children branches or users exists */}
        <When condition={isMouseEnter && this.hasChildren()}>
          <Choose>
            <When condition={!children.length && !users.length}>
              <PlusIcon
                onClick={this.handleExpandChildren}
                className="HierarchyItemBranch__icon HierarchyItemBranch__link"
              />
            </When>
            <Otherwise>
              <MinusIcon
                onClick={this.handleHideChildren}
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
  }

  renderTitle() {
    const {
      uuid,
      name,
      branchType,
    } = this.props;

    return (
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
  }

  render() {
    const {
      uuid,
      manager,
      brandId,
      branchType,
      childrenCount,
      usersCount,
    } = this.props;

    const {
      children,
      users,
    } = this.state;

    return (
      <div className="HierarchyItemBranch">
        <div
          className="HierarchyItemBranch__content"
          onMouseEnter={this.handleMouseEvent(true)}
          onMouseLeave={this.handleMouseEvent(false)}
        >
          <div className="HierarchyItemBranch__left-content">
            {this.renderIcon()}
            <div>
              {this.renderTitle()}
              <span className="HierarchyItemBranch__type">
                {branchType}
              </span>
              <div className="HierarchyItemBranch__description">
                {I18n.t('HIERARCHY.TREE.ITEM_DESCRIPTION', { childrenCount, usersCount })}
              </div>
            </div>
          </div>
          <div>
            <div className="HierarchyItemBranch__manager">
              {I18n.t('HIERARCHY.TREE.MANAGER')}:&nbsp;
              <Choose>
                <When condition={manager}>
                  <Link
                    to={`/operators/${manager.uuid}`}
                    target="_blank"
                    className="HierarchyItemBranch__manager-title HierarchyItemBranch__link"
                  >
                    <OperatorIcon id={`manager-${manager.uuid}`} className="HierarchyItemBranch__manager-icon" />
                    <UncontrolledTooltip target={`manager-${manager.uuid}`}>
                      {manager.fullName}
                    </UncontrolledTooltip>
                  </Link>
                </When>
                <Otherwise>
                  {I18n.t('HIERARCHY.TREE.MANAGER_NOT_SELECTED')}
                </Otherwise>
              </Choose>
            </div>
          </div>
        </div>

        <If condition={children.length || users.length}>
          <div className="HierarchyItemBranch__children">
            {children.map(branch => <HierarchyItemBranch key={branch.uuid} {...this.props} {...branch} />)}
            {users.map(user => (
              <HierarchyItemUser
                key={user.uuid}
                branchUUID={uuid}
                branchBrandId={brandId}
                {...user}
              />
            ))}
          </div>

          <div className="HierarchyItemBranch__separator" />
        </If>
      </div>
    );
  }
}

export default compose(
  withApollo,
)(HierarchyItemBranch);
