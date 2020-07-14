import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const createCustomTooltip = label => (
  class extends PureComponent {
    static propTypes = {
      active: PropTypes.bool.isRequired,
      payload: PropTypes.array.isRequired,
    };

    render() {
      const { active, payload: [data] } = this.props;

      return (
        <If condition={active}>
          <div className="custom-tooltip">
            <div className="label">
              {`${moment(data.payload.entryDate).format('YYYY-MM-DD')} - `}
              {moment(data.payload.entryDate).format('dddd')}
            </div>
            <div className="intro">{label} {data.value}</div>
          </div>
        </If>
      );
    }
  }
);

export default createCustomTooltip;
