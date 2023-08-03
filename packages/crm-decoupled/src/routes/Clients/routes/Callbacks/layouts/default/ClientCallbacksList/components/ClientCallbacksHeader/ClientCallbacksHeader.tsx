import React from 'react';
import I18n from 'i18n-js';
import Link from 'components/Link';
import './ClientCallbacksHeader.scss';

type Props = {
  totalElements?: number,
}

const ClientCallbacksHeader = (props: Props) => {
  const { totalElements } = props;

  return (
    <div className="ClientCallbacksHeader">
      <div className="ClientCallbacksHeader__title">
        <If condition={!!totalElements}>
          <strong>{totalElements} </strong>
        </If>

        {I18n.t('CALLBACKS.CALLBACKS')}
      </div>

      <div className="ClientCallbacksHeader__calendar">
        <Link to="/clients/callbacks/calendar">
          <i className="fa fa-calendar" />
        </Link>
      </div>
    </div>
  );
};

export default React.memo(ClientCallbacksHeader);
