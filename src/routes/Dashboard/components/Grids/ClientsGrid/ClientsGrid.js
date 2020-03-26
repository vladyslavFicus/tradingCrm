import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import columns from './utils';

class ClientsGrid extends PureComponent {
  static propTypes = {
    profiles: PropTypes.shape({
      profiles: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.newProfile),
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
        <Grid
          data={profilesEntities}
          isLoading={loading}
          withRowsHover
          withNoResults={profilesEntities.length === 0}
        >
          {columns().map(({ name, header, render }) => (
            <GridColumn
              key={name}
              name={name}
              header={header}
              render={render}
            />
          ))}
        </Grid>
      </div>
    );
  }
}

export default ClientsGrid;
