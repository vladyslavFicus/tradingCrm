import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import moment from 'moment';
import { typesLabels, typesColor, types } from '../../../../../../../constants/devices';
import PropTypes from '../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../components/GridView';
import DevicesFilterForm from './FilterForm';
import renderLabel from '../../../../../../../utils/renderLabel';
import Uuid from '../../../../../../../components/Uuid';
import IpFlag from '../../../../../../../components/IpFlag';
import TabHeader from '../../../../../../../components/TabHeader';

class View extends Component {
  static propTypes = {
    fetchEntities: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }).isRequired,
    fetchFilters: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      data: PropTypes.shape({
        deviceType: PropTypes.arrayOf(PropTypes.string).isRequired,
        operatingSystem: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number.isRequired,
    }).isRequired,
    list: PropTypes.pageableState(PropTypes.userDeviceEntity).isRequired,
    locale: PropTypes.string.isRequired,
  };

  static contextTypes = {
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
  };

  componentWillMount() {
    this.context.cacheChildrenComponent(this);
  }

  componentDidMount() {
    this.handleRefresh();
    this.props.fetchFilters(this.props.match.params.id);
  }

  handleRefresh = () => {
    this.props.fetchEntities(this.props.match.params.id, this.state.filters);
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters }, () => this.handleRefresh());
  };

  handlePageChanged = (page) => {
    if (!this.props.list.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  renderDeviceId = data => (
    <div>
      <div className="font-weight-700"><Uuid uuid={data.hash} uuidPrefix="DV" length={8} /></div>
      <div className="font-size-11">
        {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={this.props.match.params.id} uuidPrefix="PL" />
      </div>
    </div>
  );

  renderType = data => (
    <div className={typesColor[data.deviceType]}>
      <i
        className={classNames('fa font-size-20 pr-2', {
          'fa-mobile': data.deviceType === types.MOBILE,
          'fa-desktop': data.deviceType === types.DESKTOP,
          'fa-default': data.deviceType === types.UNKNOWN,
        })}
        aria-hidden="true"
      />
      {renderLabel(data.deviceType, typesLabels)}
    </div>
  );

  renderLastIp = (data) => {
    if (!data.lastSignInCountryCode) {
      return data.lastSignInCountryCode;
    }

    const id = `last-ip-${data.hash}`;

    return <IpFlag id={id} country={data.lastSignInCountryCode} ip={data.lastSignInIP} />;
  };

  renderLastLogin = (data) => {
    const dateTime = moment.utc(data.lastSignInDate).local();

    return (
      <div>
        <div className="font-weight-700">
          {dateTime.format('DD.MM.YYYY')}
        </div>
        <div className="font-size-11">
          {dateTime.format('HH:mm:ss')}
        </div>
      </div>
    );
  };

  render() {
    const {
      list: { entities, noResults },
      locale,
      filters: {
        data: { deviceType, operatingSystem },
      },
    } = this.props;
    const { filters } = this.state;

    return (
      <Fragment>
        <TabHeader title={I18n.t('PLAYER_PROFILE.DEVICES.TITLE')} />
        <DevicesFilterForm
          deviceType={deviceType}
          operatingSystem={operatingSystem}
          onSubmit={this.handleFiltersChanged}
          initialValues={filters}
        />
        <div className="tab-wrapper">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            locale={locale}
            showNoResults={noResults}
          >
            <GridViewColumn
              name="deviceId"
              header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.DEVICE_ID')}
              render={this.renderDeviceId}
            />

            <GridViewColumn
              name="deviceType"
              header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.TYPE')}
              className="text-uppercase"
              render={this.renderType}
            />

            <GridViewColumn
              name="operatingSystem"
              header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.OPERATING_SYSTEM')}
              className="font-weight-700"
            />

            <GridViewColumn
              name="lastSignInCountryCode"
              header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.LAST_IP')}
              render={this.renderLastIp}
            />

            <GridViewColumn
              name="lastSignInDate"
              header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.LAST_LOGIN')}
              render={this.renderLastLogin}
            />

            <GridViewColumn
              name="totalSignIn"
              header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.TOTAL_LOGIN')}
              className="font-weight-700"
            />
          </GridView>
        </div>
      </Fragment>
    );
  }
}

export default View;
