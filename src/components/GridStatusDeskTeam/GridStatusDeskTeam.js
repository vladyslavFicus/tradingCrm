import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { branchTypes } from 'constants/hierarchyTypes';

class GridStatusDeskTeam extends PureComponent {
  static propTypes = {
    fullName: PropTypes.string,
    hierarchy: PropTypes.shape({
      parentBranches: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          branchType: PropTypes.string,
          parentBranch: PropTypes.shape({
            name: PropTypes.string,
            branchType: PropTypes.string,
          }),
        }),
      ),
    }),
  };

  static defaultProps = {
    fullName: null,
    hierarchy: null,
  };

  render() {
    const { fullName, hierarchy } = this.props;

    const branches = hierarchy ? hierarchy.parentBranches : null;

    let team = null;
    let desk = null;

    if (branches) {
      team = branches.find(branch => branch.branchType === branchTypes.TEAM);
      desk = team ? team.parentBranch : branches.find(branch => branch.branchType === branchTypes.DESK);
    }

    return (
      <Fragment>
        <If condition={fullName}>
          <div>
            {fullName}
          </div>
        </If>
        <If condition={desk}>
          <div>
            <b>{I18n.t('DESKS.GRID_HEADER.DESK')}:</b> {desk.name}
          </div>
        </If>
        <If condition={team}>
          <div>
            <b>{I18n.t('TEAMS.GRID_HEADER.TEAM')}:</b> {team.name}
          </div>
        </If>
      </Fragment>
    );
  }
}

export default GridStatusDeskTeam;
