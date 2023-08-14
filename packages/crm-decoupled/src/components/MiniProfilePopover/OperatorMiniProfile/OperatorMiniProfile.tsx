import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { Utils, Constants } from '@crm/common';
import { ShortLoader } from 'components';
import {
  MiniProfile,
  MiniProfileHeader,
  MiniProfileContent,
  MiniProfileContentItem,
} from '../components';
import { operatorStatusNames } from '../constants';
import { Statuses } from '../types';
import { useOperatorMiniProfileQuery } from './graphql/__generated__/OperatorMiniProfileQuery';
import './OperatorMiniProfile.scss';

type Props = {
  uuid: string,
};

const OperatorMiniProfile = (props: Props) => {
  const { uuid } = props;

  const { data, loading } = useOperatorMiniProfileQuery({
    variables: { uuid },
  });

  if (loading) {
    return (
      <div className="OperatorMiniProfile__loader">
        <ShortLoader />
      </div>
    );
  }

  const {
    authorities,
    registrationDate,
    operatorStatus,
    fullName,
    country,
  } = data?.operator || {};

  return (
    <MiniProfile
      className="OperatorMiniProfile"
      status={operatorStatusNames[operatorStatus as keyof typeof operatorStatusNames] as Statuses}
    >
      <MiniProfileHeader
        label={operatorStatus || ''}
        type={I18n.t('MINI_PROFILE.OPERATOR')}
        title={fullName || ''}
        uuid={uuid}
        uuidDesctiption={country || ''}
      >
        <If condition={!!authorities?.length}>
          <div className="OperatorMiniProfile__departments">
            {authorities?.map(authority => (
              <div className="OperatorMiniProfile__department" key={authority?.id}>
                <span>
                  {I18n.t(Utils.renderLabel(authority?.department || '', Constants.Operator.departmentsLabels))}
                </span>
                {' - '}
                <span>{I18n.t(Utils.renderLabel(authority?.role || '', Constants.Operator.rolesLabels))}</span>
              </div>
            ))}
          </div>
        </If>
      </MiniProfileHeader>

      <MiniProfileContent>
        <MiniProfileContentItem
          label={I18n.t('MINI_PROFILE.REGISTERED')}
          heading={moment.utc(registrationDate || '').local().fromNow()}
          description={I18n.t('COMMON.DATE_ON', {
            date: moment.utc(registrationDate || '').local().format('DD.MM.YYYY HH:mm'),
          })}
        />
      </MiniProfileContent>
    </MiniProfile>
  );
};

export default React.memo(OperatorMiniProfile);
