import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../../../../components/GridView';
import Uuid from '../../../../../../../../components/Uuid';
import { targetTypes } from '../../../../../../../../constants/note';
import BonusHeaderNavigation from '../../../../components/BonusHeaderNavigation';
import Amount from '../../../../../../../../components/Amount';
import FreeSpinStatus from "../../../../../../../../components/FreeSpinStatus/FreeSpinStatus";

class View extends Component {
  static propTypes = {
    list: PropTypes.shape({
      entities: PropTypes.pageable(PropTypes.freeSpinEntity),
    }).isRequired,
    currency: PropTypes.string.isRequired,
    fetchFreeSpins: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  };
  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    setNoteChangedCallback: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.handleRefresh();
  }

  componentDidMount() {
    this.context.setNoteChangedCallback(this.handleRefresh);
  }

  componentWillUnmount() {
    this.context.setNoteChangedCallback(null);
  }

  getNotePopoverParams = () => ({
    placement: 'left',
  });

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(data.bonusUUID, targetTypes.BONUS)(target, this.getNotePopoverParams());
    }
  };

  handleRefresh = () => this.props.fetchFreeSpins({
    ...this.state.filters,
    page: this.state.page,
    playerUUID: this.props.params.id,
  });

  renderFreeSpin = data => (
    <div>
      <div className="font-weight-700">
        {data.name}
      </div>
      <div className="font-size-10">
        <Uuid uuid={data.uuid} />
      </div>
      <div className="font-size-10">
        <Uuid uuid={data.authorUuid} />
      </div>
    </div>
  );

  renderAvailable = data => (
    <div>
      <div className="font-weight-700">
        {moment.utc(data.startDate).local().format('DD.MM.YYYY HH:mm')}
      </div>
      <div className="font-size-10">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.DATE_TO', {
          time: moment.utc(data.endDate).local().format('DD.MM.YYYY HH:mm'),
        })}
      </div>
    </div>
  );

  renderGranted = (data) => {
    const { currency } = this.props;

    return (
      <div>
        <div className="font-weight-700">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.FREE_SPIN_COUNT', { count: data.freeSpinsAmount })}
        </div>
        <div className="font-size-10">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.SPIN_VALUE')}:&nbsp;
          <Amount currency={currency} amount={data.spinValue} />
        </div>
        <div className="font-size-10">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.TOTAL_VALUE')}:&nbsp;
          <Amount currency={currency} amount={data.totalValue} />
        </div>
      </div>
    );
  };

  renderStatus = data => (
    <FreeSpinStatus
      campaign={data}
    />
  );

  render() {
    const { list: { entities } } = this.props;

    return (
      <div className="tab-pane fade in active profile-tab-container">
        <div className="row margin-bottom-20">
          <div className="col-md-6 col-xs-6">
            <BonusHeaderNavigation />
          </div>
        </div>

        <GridView
          tableClassName="table table-hovered data-grid-layout"
          headerClassName=""
          dataSource={entities.content}
          onPageChange={this.handlePageChanged}
          activePage={entities.number + 1}
          totalPages={entities.totalPages}
        >
          <GridColumn
            name="freeSpin"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.FREE_SPIN')}
            headerClassName="text-uppercase"
            render={this.renderFreeSpin}
          />
          <GridColumn
            name="availability"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.AVAILABILITY')}
            headerClassName="text-uppercase"
            render={this.renderAvailable}
          />
          <GridColumn
            name="granted"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.GRANTED')}
            headerClassName="text-uppercase"
            render={this.renderGranted}
          />
          <GridColumn
            name="status"
            header={I18n.t('PLAYER_PROFILE.FREE_SPINS.GRID_VIEW.STATUS')}
            headerClassName="text-uppercase"
            render={this.renderStatus}
          />
        </GridView>
      </div>
    );
  }
}

export default View;
