import React, { Component, PropTypes } from 'react';
import Table from './Table';
import { Pagination } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actionCreators as campaignsListActionCreators } from '../modules/list';
import { Link } from 'react-router';

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        state: '',
        page: 0,
      },
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.onFiltersChanged = this.onFiltersChanged.bind(this);
  }

  setFilter(name, value) {
    return this.setFilters({ [name]: value });
  }

  setFilters(filters) {
    return this.setState({
      filters: {
        ...this.state.filters,
        ...filters,
      },
    }, this.onFiltersChanged);
  }

  onFiltersChanged() {
    this.props.loadEntities(this.state.filters);
  }

  handleStatusChange(e) {
    const target = e.target;

    this.setFilter('state', target.value);
  }

  handleSelect(eventKey) {
    this.setFilter('page', eventKey - 1);
  }

  componentWillMount() {
    const { campaigns } = this.props;

    if (!campaigns.isLoading) {
      this.onFiltersChanged();
    }
  }

  render() {
    const { campaigns: data } = this.props;
    const { entities, isLoading } = data;

    return <div className="page-content-inner">
      <section className="panel panel-with-borders">
        <div className="panel-heading">
          <h3>Bonus campaigns</h3>
        </div>

        <div className="panel-body">
          <div className="row margin-bottom-15">
            <div className="col-lg-12">
              <div className="text-right">
                <Link to={'/bonus-campaigns/create'} className="btn btn-primary">Create campaign</Link>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <Table
                isLoading={isLoading}
                items={entities.content}
                handleStatusChange={this.handleStatusChange}
              />
            </div>
          </div>

          {entities.totalPages > 1 && <div className="row">
            <div className="col-lg-12">
              <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={entities.totalPages}
                maxButtons={5}
                activePage={entities.number + 1}
                onSelect={this.handleSelect}/>
            </div>
          </div>}
        </div>
      </section>
    </div>;
  }
}

const mapStateToProps = (state) => ({
  campaigns: {
    ...state.bonusCampaignsList,
  },
});
const mapActions = {
  ...campaignsListActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
