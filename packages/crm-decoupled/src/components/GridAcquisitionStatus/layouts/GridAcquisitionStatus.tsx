import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import GridEmptyValue from 'components/GridEmptyValue';
import HideText from 'components/HideText';
import useGridAcquisitionStatus, { Hierarchy } from '../hooks/useGridAcquisitionStatus';
import './GridAcquisitionStatus.scss';

type Props = {
  active?: boolean,
  acquisition: 'SALES' | 'RETENTION',
  status?: string,
  fullName: string,
  hierarchy?: Hierarchy,
};

const GridAcquisitionStatus = (props: Props) => {
  const {
    active,
    acquisition,
    status = '',
    fullName,
    hierarchy,
  } = props;

  const { statusTitle, color, team, desk } = useGridAcquisitionStatus({ acquisition, status, hierarchy });

  return (
    <Choose>
      <When condition={!!status}>
        <div className={
          classNames(
            'GridAcquisitionStatus',
            `GridAcquisitionStatus--${color}`,
            { 'GridAcquisitionStatus--active': active },
          )}
        >
          <div className={classNames('GridAcquisitionStatus__general', `GridAcquisitionStatus__general--${color}`)}>
            {I18n.t(statusTitle)}
          </div>

          <div className="GridAcquisitionStatus__additional">
            <If condition={!!fullName}>
              <p>
                {fullName}
              </p>
            </If>

            <If condition={!!desk}>
              <b>{I18n.t('DESKS.GRID_HEADER.DESK')}:</b> <HideText text={desk?.name || ''} />
            </If>

            <If condition={!!team}>
              <b>{I18n.t('TEAMS.GRID_HEADER.TEAM')}:</b> <HideText text={team?.name || ''} />
            </If>
          </div>
        </div>
      </When>

      <Otherwise>
        <GridEmptyValue />
      </Otherwise>
    </Choose>
  );
};

export default React.memo(GridAcquisitionStatus);
