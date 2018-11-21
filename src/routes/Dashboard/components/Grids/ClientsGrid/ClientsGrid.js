import React, { PureComponent } from 'react';
import { get } from 'lodash';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import ShortLoader from '../../../../../components/ShortLoader';
import columns from './utils';

class ClientsGrid extends PureComponent {
  static propTypes = {
    profiles: PropTypes.shape({
      profiles: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.any),
      }),
      loading: PropTypes.bool.isRequired,
    }).isRequired,
    auth: PropTypes.shape({
      brandId: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
    }).isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
  };

  render() {
    const {
      profiles,
      auth,
      fetchPlayerMiniProfile,
    } = this.props;

    const profilesEntities = get(profiles, 'profiles.data.content', []);

    return (
      <div className="card card-body">
        <Choose>
          <When condition={profiles.loading}>
            <ShortLoader />
          </When>
          <Otherwise>
            <GridView
              dataSource={profilesEntities}
              showNoResults={profilesEntities.length === 0}
              tableClassName="table-hovered table-bordered"
            >
              {columns({ auth, fetchPlayerMiniProfile }).map(({ name, header, render }) => (
                <GridViewColumn
                  key={name}
                  name={name}
                  header={header}
                  render={render}
                />
              ))}
            </GridView>
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default ClientsGrid;
