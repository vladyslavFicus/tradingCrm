import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import GridView, { GridViewColumn } from 'components/GridView';
import columns from './utils';

class ClientsGrid extends PureComponent {
  static propTypes = {
    profiles: PropTypes.shape({
      profiles: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.any),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
  };

  render() {
    const {
      profiles,
      profiles: { loading },
    } = this.props;

    const profilesEntities = get(profiles, 'profiles.data.content', []);

    return (
      <div className="card card-body">
        <GridView
          loading={loading}
          dataSource={profilesEntities}
          showNoResults={profilesEntities.length === 0}
          tableClassName="table-hovered"
          rowClassName={({ tradingProfile }) => !tradingProfile && 'disabled'}
        >
          {columns().map(({ name, header, render }) => (
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

export default ClientsGrid;
