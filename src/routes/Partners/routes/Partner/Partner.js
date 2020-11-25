import React, { PureComponent, Suspense } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { compose } from 'react-apollo';
import { get } from 'lodash';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import { partnerTabs } from 'config/menu';
import NotFound from 'routes/NotFound';
import Tabs from 'components/Tabs';
import Route from 'components/Route';
import HideDetails from 'components/HideDetails';
import PartnerProfileTab from './routes/PartnerProfileTab';
import PartnerFeedsTab from './routes/PartnerFeedsTab';
import PartnerSalesRulesTab from './routes/PartnerSalesRulesTab';
import PartnerHeader from './components/PartnerHeader';
import PartnerAccountStatus from './components/PartnerAccountStatus';
import PartnerRegistrationInfo from './components/PartnerRegistrationInfo';
import PartnerPersonalInfo from './components/PartnerPersonalInfo';
import PartnerAdditionalInfo from './components/PartnerAdditionalInfo';
import PartnerQuery from './graphql/PartnerQuery';
import './Partner.scss';

class Partner extends PureComponent {
  static propTypes = {
    partnerData: PropTypes.query({
      partner: PropTypes.partner,
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

    const partner = get(partnerData, 'data.partner') || {};
    const partnerError = get(partnerData, 'error') || false;
    const authorities = get(partner, 'authorities') || [];
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
              <PartnerAdditionalInfo authorities={authorities} />
            </div>
          </HideDetails>
        </div>

        <Tabs items={partnerTabs} />

        <div className="Partner__tab-content">
          <Suspense fallback={null}>
            <Switch>
              <Route path={`${path}/profile`} render={() => <PartnerProfileTab partnerData={partnerData} />} />
              <Route path={`${path}/sales-rules`} component={PartnerSalesRulesTab} />
              <Route path={`${path}/feed`} component={PartnerFeedsTab} />
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
    partnerData: PartnerQuery,
  }),
)(Partner);
