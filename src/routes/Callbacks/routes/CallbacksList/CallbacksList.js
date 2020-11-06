import React, { PureComponent } from 'react';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { Link } from 'components/Link';
import CallbacksGridFilter from './components/CallbacksGridFilter';
import CallbacksGrid from './components/CallbacksGrid';
import getCallbacksQuery from './graphql/getCallbacksQuery';
import './CallbacksList.scss';

class CallbacksList extends PureComponent {
  static propTypes = {
    callbacksData: PropTypes.query({
      callbacks: PropTypes.pageable(PropTypes.callback),
    }).isRequired,
  };

  render() {
    const { callbacksData } = this.props;

    const { totalElements } = get(callbacksData, 'data.callbacks') || {};

    return (
      <div className="CallbacksList">
        <div className="CallbacksList__header">
          <div className="CallbacksList__title">
            <If condition={totalElements}>
              <strong>{totalElements} </strong>
            </If>
            {I18n.t('CALLBACKS.CALLBACKS')}
          </div>

          <div className="CallbacksList__calendar">
            <Link to="/callbacks/calendar">
              <i className="fa fa-calendar" />
            </Link>
          </div>
        </div>

        <CallbacksGridFilter handleRefetch={callbacksData.refetch} />
        <CallbacksGrid callbacksData={callbacksData} />
      </div>
    );
  }
}

export default withRequests({
  callbacksData: getCallbacksQuery,
})(CallbacksList);
