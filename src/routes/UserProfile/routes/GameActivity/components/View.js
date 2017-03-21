import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import GridView, { GridColumn } from '../../../../../components/GridView';

class View extends Component {
  static propTypes = {
    entities: PropTypes.shape().isRequired,
    games: PropTypes.shape().isRequired,
    providers: PropTypes.shape().isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    isLoading: false,
  };

  componentWillMount() {
    this.handleFiltersChanged();
  }

  handlePageChanged = (page, filters) => {
    if (!this.props.isLoading) {
      this.props.fetchGameActivity(this.props.params.id, { ...filters, page: page - 1 });
    }
  };

  handleFiltersChanged = (filters) => {
    this.props.fetchGameActivity(this.props.params.id, { ...filters, page: 0 });
  };

  render() {
    const {
      entities,
      games,
      providers,
    } = this.props;

    return <div className={classNames('tab-pane fade in active')}>
      <GridView
        dataSource={entities.content}
        onFiltersChanged={this.handleFiltersChanged}
        onPageChange={this.handlePageChanged}
        activePage={entities.number + 1}
        totalPages={entities.totalPages}
      >
        <GridColumn name="" />
      </GridView>
    </div>;
  }
}

export default View;
