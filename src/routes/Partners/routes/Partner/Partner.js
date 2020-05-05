import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { compose } from 'react-apollo';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { partnerProfileTabs } from 'config/menu';
import NotFound from 'routes/NotFound';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import SalesRules from 'components/SalesRules';
import HideDetails from 'components/HideDetails';
import PartnerEdit from './routes/Edit';
import Feed from './routes/Feed';
import PartnerHeader from './components/PartnerHeader';
import PartnerAccountStatus from './components/PartnerAccountStatus';
import PartnerRegistrationInfo from './components/PartnerRegistrationInfo';
import PartnerPersonalInfo from './components/PartnerPersonalInfo';
import PartnerAdditionalInfo from './components/PartnerAdditionalInfo';
import getPartnerQuery from './graphql/getPartnerQuery';
import './Partner.scss';

class Partner extends PureComponent {
  static propTypes = {
    partnerData: PropTypes.query({
      partner: PropTypes.shape({
        data: PropTypes.partner,
      }),
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string,
      url: PropTypes.string,
    }).isRequired,
  };

  render() {
    const {
      partnerData,
      match: { path, url },
    } = this.props;

    const partner = get(partnerData, 'data.partner.data') || {};
    const partnerError = get(partnerData, 'data.partner.error') || false;
    const isLoading = partnerData.loading;

    if (partnerError) {
      return <NotFound />;
    }

    if (isLoading) {
      return null;
    }

    return (
      <div className="Partner">
        <div className="Partner__content">
          <PartnerHeader partner={partner} />

          <div className="Partner__info">
            <PartnerAccountStatus partner={partner} refetchPartner={partnerData.refetch} />
            <PartnerRegistrationInfo createdAt={partner.createdAt} />
          </div>

          <HideDetails>
            <div className="Partner__details">
              <PartnerPersonalInfo partner={partner} />
              <PartnerAdditionalInfo authorities={partner.authorities && partner.authorities.data} />
            </div>
          </HideDetails>
        </div>

        <Tabs items={partnerProfileTabs} />

        <div className="Partner__tab-content">
          <Suspense fallback={null}>
            <Switch>
              <Route path={`${path}/profile`} component={PartnerEdit} />
              <Route path={`${path}/sales-rules`} render={props => <SalesRules {...props} type="PARTNER" />} />
              <Route path={`${path}/feed`} component={Feed} />
              <Redirect to={`${url}/profile`} />
            </Switch>
          </Suspense>
        </div>
      </div>
    );
  }
}

export default compose(
  withRequests({
    partnerData: getPartnerQuery,
  }),
)(Partner);
