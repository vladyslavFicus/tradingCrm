import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../../../components/GridView';
import ActionsDropDown from '../../../../../../../../../components/ActionsDropDown';
import columns from './utils';

class View extends PureComponent {
  static propTypes = {
    playerProfile: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      playerProfile: PropTypes.shape({
        mt4Users: PropTypes.arrayOf(PropTypes.mt4User),
      }),
    }).isRequired,
    locale: PropTypes.string.isRequired,
    modals: PropTypes.shape({
      tradingAccountAddModal: PropTypes.modalType,
      tradingAccountChangePasswordModal: PropTypes.modalType,
    }).isRequired,
  };

  static contextTypes = {
    setRenderActions: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      context: {
        setRenderActions,
      },
    } = this;

    setRenderActions(() => (
      <button type="button" className="btn btn-default-outline" onClick={this.showTradingAccountAddModal}>
        {I18n.t('CLIENT_PROFILE.ACCOUNTS.ADD_TRADING_ACC')}
      </button>
    ));
  }

  showTradingAccountAddModal = () => {
    const { playerUUID: profileId, currency } = get(this.props.playerProfile, 'playerProfile.data', {});
    this.props.modals.tradingAccountAddModal.show({
      profileId,
      currency,
      onConfirm: this.props.playerProfile.refetch,
    });
  };

  renderActions = ({ login }) => (
    <ActionsDropDown
      items={[
        {
          label: I18n.t('CLIENT_PROFILE.ACCOUNTS.ACTIONS_DROPDOWN.CHANGE_PASSWORD'),
          onClick: () => this.props.modals.tradingAccountChangePasswordModal.show({ login }),
        },
      ]}
    />
  );

  render() {
    const {
      playerProfile,
      locale,
    } = this.props;

    const mt4Users = get(playerProfile, 'playerProfile.data.tradingProfile.mt4Users') || [];

    return (
      <div className="tab-wrapper">
        <GridView
          tableClassName="table-hovered"
          dataSource={mt4Users}
          locale={locale}
          showNoResults={!playerProfile.loading && mt4Users.length === 0}
        >
          {columns.map(({ name, header, render }) => (
            <GridViewColumn
              key={name}
              name={name}
              header={header}
              render={render}
            />
          ))}
          <GridViewColumn
            name="actions"
            headerStyle={{ width: '5%' }}
            render={this.renderActions}
          />
        </GridView>
      </div>
    );
  }
}

export default View;
