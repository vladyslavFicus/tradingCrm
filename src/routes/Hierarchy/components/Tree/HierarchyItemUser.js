import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import capitalize from 'utils/capitalize';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import { ReactComponent as OperatorIcon } from './img/OperatorIcon.svg';
import './HierarchyItemUser.scss';

class HierarchyItemUser extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    branchUUID: PropTypes.string.isRequired,
    branchBrandId: PropTypes.string.isRequired,
    operator: PropTypes.shape({
      fullName: PropTypes.string,
      authorities: PropTypes.arrayOf(PropTypes.shape({
        department: PropTypes.string,
        role: PropTypes.string,
      })),
    }).isRequired,
  };

  onOperatorClick = (uuid) => {
    window.open(`/operators/${uuid}`, '_blank');
  }

  render() {
    const {
      uuid,
      branchUUID,
      branchBrandId,
      operator: {
        fullName,
        authorities: allAuthorities,
      },
    } = this.props;

    // Filter authorities only for brand where branch was created
    const authorities = allAuthorities.filter(({ brand }) => brand === branchBrandId);

    const authority = authorities[0];

    return (
      <div className="HierarchyItemUser">
        <div className="HierarchyItemUser__content">
          <div onClick={() => this.onOperatorClick(uuid)}>
            <OperatorIcon className="HierarchyItemUser__icon" />
          </div>
          <div>
            <div
              className="HierarchyItemUser__title HierarchyItemUser__link"
              onClick={() => this.onOperatorClick(uuid)}
            >
              {fullName}
            </div>
            <span className="HierarchyItemBranch__type">{I18n.t('HIERARCHY.TREE.OPERATOR')}</span>
            <div className="HierarchyItemUser__description-wrapper">
              <If condition={authority}>
                <span id={`branch-${branchUUID}-${uuid}`} className="HierarchyItemUser__description">
                  {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${authority.department}`, {
                    defaultValue: capitalize(authority.department),
                  })}
                  &nbsp;
                  {I18n.t(`CONSTANTS.OPERATORS.ROLES.${authority.role}`, { defaultValue: capitalize(authority.role) })}
                </span>
              </If>
              <If condition={authorities.length > 1}>
                <span className="HierarchyItemUser__dot" />
                <UncontrolledTooltip
                  target={`branch-${branchUUID}-${uuid}`}
                  placement="bottom"
                  delay={{ show: 100 }}
                >
                  {authorities.map(_authority => (
                    <div
                      key={`${_authority.department}-${_authority.role}`}
                      className="HierarchyItemUser__authority-item"
                    >
                      {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${_authority.department}`, {
                        defaultValue: capitalize(_authority.department),
                      })}
                      &nbsp;
                      {I18n.t(`CONSTANTS.OPERATORS.ROLES.${_authority.role}`, {
                        defaultValue: capitalize(_authority.role),
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
  }
}

export default HierarchyItemUser;
