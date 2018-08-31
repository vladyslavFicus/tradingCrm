import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import PropTypes from '../../../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../../../components/GridView';
import columns from './utils';

class View extends Component {
  static propTypes = {
    playerProfile: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      playerProfile: PropTypes.shape({
        mt4Users: PropTypes.arrayOf(PropTypes.mt4User),  
      }),
    }).isRequired,
    locale: PropTypes.string.isRequired,
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
      <button type="button" className="btn btn-default-outline">
        {I18n.t('CLIENT_PROFILE.ACCOUNTS.ADD_TRADING_ACC')}
      </button>
    ));
  }
  
  render() {
    const {
      playerProfile,
      locale,
    } = this.props;

    const mt4Users = get(playerProfile, 'playerProfile.data.tradingProfile.mt4Users', []);

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
        </GridView>
      </div>
    );
  }
}

export default View;
