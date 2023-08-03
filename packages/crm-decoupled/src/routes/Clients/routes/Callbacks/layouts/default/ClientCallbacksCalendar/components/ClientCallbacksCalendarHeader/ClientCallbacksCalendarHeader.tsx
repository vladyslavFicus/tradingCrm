import React from 'react';
import I18n from 'i18n-js';
import Link from 'components/Link';
import './ClientCallbacksCalendarHeader.scss';

type Props = {
  totalElements: number,
}

const ClientCallbacksCalendarHeader = (props: Props) => {
  const { totalElements } = props;

  return (
    <div className="ClientCallbacksCalendarHeader">
      <div className="ClientCallbacksCalendarHeader__title">
        <If condition={!!totalElements}>
          <strong>{totalElements} </strong>
        </If>

        {I18n.t('CALLBACKS.CALLBACKS')}
      </div>

      <div className="ClientCallbacksCalendarHeader__list">
        <Link to="/clients/callbacks/list">
          <i className="fa fa-list" />
        </Link>
      </div>
    </div>
  );
};

export default React.memo(ClientCallbacksCalendarHeader);
