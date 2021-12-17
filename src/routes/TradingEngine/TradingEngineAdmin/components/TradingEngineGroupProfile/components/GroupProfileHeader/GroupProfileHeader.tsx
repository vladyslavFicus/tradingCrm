import React from 'react';
import I18n from 'i18n-js';
import Uuid from 'components/Uuid';
import './GroupProfileHeader.scss';

interface Props {
  uuid?: string,
  title?: string,
}

const GroupProfileHeader = ({ uuid = '', title }: Props) => (
  <div className="GroupProfileHeader">
    <div className="GroupProfileHeader__topic">
      <Choose>
        <When condition={Boolean(uuid)}>
          <div className="GroupProfileHeader__title">
            {title}
          </div>
          <div className="GroupProfileHeader__uuid">
            <Uuid uuid={uuid} />
          </div>
        </When>
        <Otherwise>
          <div className="GroupProfileHeader__title">
            {I18n.t('TRADING_ENGINE.GROUP_PROFILE.NEW_GROUP')}
          </div>
        </Otherwise>
      </Choose>
    </div>
  </div>
);

export default React.memo(GroupProfileHeader);
