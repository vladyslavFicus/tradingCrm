import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import PropTypes from '../../../../../../constants/propTypes';
import CallbacksList, { CallbacksGridFilter } from '../../../../../../components/CallbacksList';
import Placeholder from '../../../../../../components/Placeholder';

class Callbacks extends PureComponent {
  static propTypes = {
    callbacks: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      callbacks: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.callback),
      }),
    }).isRequired,
  };

  render() {
    const {
      callbacks,
      callbacks: { loading },
    } = this.props;

    const totalElements = get(callbacks, 'callbacks.data.totalElements', 0);

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
          <CallbacksList callbacks={callbacks} />
        </div>
      </div>
    );
  }
}

export default Callbacks;
