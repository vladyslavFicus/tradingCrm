import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { branchTypes } from '../../constants/hierarchyTypes';

const GridStatusDeskTeam = ({
  fullName,
  hierarchy,
}) => {
  const branches = hierarchy ? hierarchy.parentBranches : null;
  // Find operator team and desk. If team is absent -> find desk in branches
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
};

GridStatusDeskTeam.propTypes = {
  fullName: PropTypes.string,
  hierarchy: PropTypes.shape({
    parentBranches: PropTypes.array,
  }),
};

GridStatusDeskTeam.defaultProps = {
  fullName: null,
  hierarchy: null,
};

export default GridStatusDeskTeam;
