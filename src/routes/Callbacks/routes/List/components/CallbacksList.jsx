import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import CallbacksList, { CallbacksGridFilter } from '../../../../../components/CallbacksList';
import Placeholder from '../../../../../components/Placeholder';

class Callbacks extends PureComponent {
  state = {
    loading: true,
    totalElements: 0,
  };

  onCallbacksQuery = ({ loading, callbacks }) => {
    const totalElements = get(callbacks, 'data.totalElements', 0);

    this.setState({ loading, totalElements });
  };

  render() {
    const { loading, totalElements } = this.state;

    return (
      <div className="card">
        <div className="card-heading justify-content-between">
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={<div className="animated-background" style={{ width: '120px', height: '20px' }} />}
          >
            <Choose>
              <When condition={!!totalElements}>
                <span className="font-size-20 height-55 users-list-header">
                  <div>
                    <strong>{totalElements} </strong>
                    {I18n.t('CALLBACKS.CALLBACKS')}
                  </div>
                </span>
              </When>
              <Otherwise>
                <span className="font-size-20">
                  {I18n.t('CALLBACKS.CALLBACKS')}
                </span>
              </Otherwise>
            </Choose>
          </Placeholder>
          <Link to="/callbacks/calendar">
            <i className="font-size-20 fa fa-calendar" />
          </Link>
        </div>

        <CallbacksGridFilter disabled={loading} />

        <div className="card-body">
          <CallbacksList onCallbacksQuery={this.onCallbacksQuery} />
        </div>
      </div>
    );
  }
}

export default Callbacks;
