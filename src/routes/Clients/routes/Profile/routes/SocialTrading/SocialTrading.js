import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import TabHeader from 'components/TabHeader';
import SubscribersGrid from './components/SubscribersGrid';
import ProvidersGrid from './components/ProvidersGrid';
import SubscriptionsOnProvidersGrid from './components/SubscriptionsOnProvidersGrid';
import './SocialTrading.scss';

class SocialTrading extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
  };

  state = {
    providerId: null,
  }

  handleProviderRowClick = ({ id: providerId }) => {
    this.setState({ providerId });
  };

  render() {
    const { match: { params: { id } } } = this.props;
    const { providerId } = this.state;

    return (
      <div className="SocialTrading">
        <TabHeader title={I18n.t('SOCIAL_TRADING.TITLE')} />
        <SubscribersGrid profileUuid={id} />
        <ProvidersGrid profileUuid={id} handleRowClick={this.handleProviderRowClick} />
        <If condition={providerId}>
          <SubscriptionsOnProvidersGrid providerId={providerId} />
        </If>
      </div>
    );
  }
}

export default SocialTrading;
