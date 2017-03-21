import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';

class View extends Component {
  static propTypes = {
    activity: PropTypes.pageable(PropTypes.gamingActivityEntity).isRequired,
    games: PropTypes.shape({
      entities: PropTypes.object.isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number.isRequired,
    }).isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    fetchEntities: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isLoading: false,
  };

  componentWillMount() {
    this.handleFiltersChanged();
  }

  handlePageChanged = (page, filters) => {
    if (!this.props.activity.isLoading) {
      this.props.fetchEntities(this.props.params.id, { ...filters, page: page - 1 });
    }
  };

  handleFiltersChanged = (filters) => {
    this.props.fetchEntities(this.props.params.id, { ...filters, page: 0 });
  };

  render() {
    const {
      activity,
    } = this.props;

    return <div className={classNames('tab-pane fade in active')}>
      <GridView
        dataSource={activity.entities.content}
        onFiltersChanged={this.handleFiltersChanged}
        onPageChange={this.handlePageChanged}
        activePage={activity.entities.number + 1}
        totalPages={activity.entities.totalPages}
      >
        <GridColumn name="id" />
      </GridView>
    </div>;
  }
}

export default View;
