import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';
import moment from 'moment';
import { typesLabels, typesColor, types } from '../../../../../constants/devices';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import DevicesFilterForm from './FilterForm';
import renderLabel from '../../../../../utils/renderLabel';
import Uuid from '../../../../../components/Uuid';

class View extends Component {
  static propTypes = {
    fetchEntities: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    filters: PropTypes.shape({
      data: PropTypes.shape({
        deviceType: PropTypes.arrayOf(PropTypes.string).isRequired,
        operatingSystem: PropTypes.arrayOf(PropTypes.string).isRequired,
      }).isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number.isRequired,
    }).isRequired,
    list: PropTypes.pageableState(PropTypes.userDeviceEntity).isRequired,
  };
  state = {
    filters: {},
  };

  componentDidMount() {
    this.handleRefresh();
  }

  handleRefresh = () => {
    this.props.fetchEntities(this.props.params.id, this.state.filters);
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
    <span>
      <div className="font-weight-700"><Uuid uuid={data.hash} uuidPrefix="DV" length={8} /></div>
      <span className="font-size-10 text-uppercase color-default">
        {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={this.props.params.id} uuidPrefix="PL" />
      </span>
    </span>
  );

  renderType = (data) => {
    return (
      <div className={typesColor[data.deviceType]}>
        <i
          className={classNames('fa font-size-20 padding-right-10', {
            'fa-mobile': data.deviceType === types.MOBILE,
            'fa-desktop': data.deviceType === types.DESKTOP,
            'fa-default': data.deviceType === types.UNKNOWN,
          })}
          aria-hidden="true"
        />
        {renderLabel(data.deviceType, typesLabels)}
      </div>
    );
  }

  renderLastIp = (data) => {
    if (!data.lastSignInCountryCode) {
      return data.lastSignInCountryCode;
    }

    if (data.lastSignInCountryCode === 'unknown') {
      return <div className="font-weight-700"> {I18n.t('COMMON.UNKNOWN')} </div>;
    }

    return <i className={`fs-icon fs-${data.lastSignInCountryCode.toLowerCase()}`} />;
  }

  renderLastLogin = (data) => {
    const dateTime = moment(data.lastSignInDate);

    return (
      <div>
        <div className="font-weight-700">
          {dateTime.format('DD.MM.YYYY')}
        </div>
        <span className="font-size-10 color-default">
          {dateTime.format('HH:mm:ss')}
        </span>
      </div>
    );
  };

  render() {
    const {
      list: {
        entities,
      },
      filters: {
        data: { deviceType, operatingSystem },
      },
    } = this.props;
    const { filters } = this.state;

    return (
      <div className={'profile-tab-container'}>
        <div className="row margin-bottom-20">
          <div className="col-sm-3 col-xs-6">
            <span className="font-size-20">
              {I18n.t('PLAYER_PROFILE.DEVICES.TITLE')}
            </span>
          </div>
        </div>

        <DevicesFilterForm
          deviceType={deviceType}
          operatingSystem={operatingSystem}
          onSubmit={this.handleFiltersChanged}
          initialValues={filters}
        />

        <GridView
          tableClassName="table table-hovered data-grid-layout"
          headerClassName=""
          dataSource={entities.content}
          onPageChange={this.handlePageChanged}
          activePage={entities.number + 1}
          totalPages={entities.totalPages}
        >
          <GridColumn
            name="deviceId"
            header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.DEVICE_ID')}
            headerClassName={'text-uppercase'}
            render={this.renderDeviceId}
          />

          <GridColumn
            name="deviceType"
            header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.TYPE')}
            headerClassName="text-uppercase"
            className="text-uppercase"
            render={this.renderType}
          />

          <GridColumn
            name="operatingSystem"
            header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.OPERATING_SYSTEM')}
            headerClassName={'text-uppercase'}
            className="font-weight-700"
          />

          <GridColumn
            name="lastSignInCountryCode"
            header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.LAST_IP')}
            headerClassName={'text-uppercase'}
            render={this.renderLastIp}
          />

          <GridColumn
            name="lastSignInDate"
            header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.LAST_LOGIN')}
            headerClassName={'text-uppercase'}
            render={this.renderLastLogin}
          />

          <GridColumn
            name="totalSignIn"
            header={I18n.t('PLAYER_PROFILE.DEVICES.GRID_VIEW.TOTAL_LOGIN')}
            headerClassName={'text-uppercase'}
            className="font-weight-700"
          />
        </GridView>

      </div>
    );
  }
}

export default View;
