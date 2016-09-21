import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
import Table from './Table';
import { Pagination } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actionCreators as listActionCreators } from '../modules/list';
import { Link } from 'react-router';

class List extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        label: '',
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
    this.props.fetchEntities(this.state.filters);
  }

  handleStatusChange(e) {
    const target = e.target;

    this.setFilter('state', target.value);
  }

  handleSelect(eventKey) {
    this.setFilter('page', eventKey - 1);
  }

  componentWillMount() {
    const { bonuses } = this.props;

    if (!bonuses.isLoading) {
      this.onFiltersChanged();
    }
  }

  render() {
    const { bonuses: data } = this.props;
    const { entities, isLoading } = data;

    return <div className="page-content-inner">
      <Panel withBorders>
        <Title>
          <h3>Bonuses</h3>
        </Title>

        <Content>
          <div className="row margin-bottom-15">
            <div className="col-lg-12">
              <div className="text-right">
                <Link to={'/bonuses/create'} className="btn btn-primary">Create bonus</Link>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <Table
                isLoading={isLoading}
                items={entities.content}
                handleStatusChange={this.handleStatusChange}
                onChangeCampaignState={this.handleChangeCampaignState}
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
        </Content>
      </Panel>
    </div>;
  }
}

const mapStateToProps = (state) => ({
  bonuses: {
    ...state.bonusesList,
  },
});
const mapActions = {
  ...listActionCreators,
};

export default connect(mapStateToProps, mapActions)(List);
