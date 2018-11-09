import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from '../../../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../../../components/GridView';
import columns from './utils';

class View extends PureComponent {
  static propTypes = {
    playerProfile: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      playerProfile: PropTypes.shape({
        mt4Users: PropTypes.arrayOf(PropTypes.mt4User),
      }),
    }).isRequired,
    locale: PropTypes.string.isRequired,
  };

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
        </GridView>
      </div>
    );
  }
}

export default View;
