import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import UnitValue from '../UnitValue';
import './Information.scss'; // remove

class Information extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  render() {
    const {
      data: {
        targetType,
        totalSelectedPlayers,
        totalOptInPlayers,
        startDate,
        endDate,
        conversionPrize,
        currency,
        capping,
        wagerWinMultiplier,
        campaignRatio,
        eventsType,
      },
    } = this.props;

    return (
      <div className="player__account__details row">
        <div className="col-md-3">
          <div className="player__account__details_personal">
            <span className="player__account__details-label">Target</span>
            <div className="panel">
              <div className="panel-body height-200">
                <div>
                  <strong>Target type</strong>: {targetType}
                </div>
                <div>
                  <strong>Players selected</strong>: {totalSelectedPlayers}
                </div>
                <div>
                  <strong>Players opted-in</strong>: {totalOptInPlayers}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="player__account__details_personal">
            <span className="player__account__details-label">Fulfillment & reward parameters</span>
            <div className="panel">
              <div className="panel-body height-200">
                <div>
                  <strong>Fulfillment type:</strong> {eventsType.join(', ')}
                </div>
                <div>
                  <strong>Ratio:</strong> <UnitValue {...campaignRatio} currency={currency} />
                </div>
                <div>
                  <strong>Multiplayer: x</strong>{wagerWinMultiplier}
                </div>
                <div>
                  <strong>Life time:</strong> {' '}
                  { moment().isSameOrAfter(endDate) ? 0 : moment(endDate).fromNow() }
                </div>
                <div>
                  <strong>Campaign start:</strong> {moment(startDate).format('DD.MM.YYYY HH:mm')}
                </div>
                <div>
                  <strong>Campaign end:</strong> {moment(endDate).format('DD.MM.YYYY HH:mm')}
                </div>
                <div>
                  <strong>Prize:</strong> <UnitValue {...conversionPrize} currency={currency} />
                </div>
                <div>
                  <strong>Capping:</strong> <UnitValue {...capping} currency={currency} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Information;
