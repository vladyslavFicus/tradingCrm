import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { GridView, GridViewColumn, Card, CardBody, CardHeading, Button } from '@newage/casino_backoffice_ui';
import PropTypes from 'prop-types';
import { actions } from '../constants';
import FilterForm from './FilterForm';
import StatusDropDown from './StatusDropDown';
import history from '../../../../../router/history';

class ConditionalTagsList extends Component {
  static propTypes = {
    disableTag: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      addTags: PropTypes.shape({
        show: PropTypes.func.isRequired,
        hide: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    conditionalTags: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loadMoreTags: PropTypes.func.isRequired,
      conditionalTags: PropTypes.shape({
        data: PropTypes.shape({
          number: PropTypes.number,
          totalPages: PropTypes.number,
          last: PropTypes.bool,
          content: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            count: PropTypes.number,
            tag: PropTypes.string,
            conditionStatus: PropTypes.string,
            conditionType: PropTypes.string,
          })),
        }),
      }),
    }).isRequired,
    locale: PropTypes.string.isRequired,
  };

  handleAddTags = () => {
    const {
      conditionalTags: { refetch },
      modals: { addTags },
    } = this.props;

    addTags.show({ onConfirm: refetch });
  };

  handleStatusChange = (action, uuid) => {
    const { disableTag } = this.props;

    if (action === actions.DISABLE) {
      disableTag({ variables: { uuid } });
    }
  };

  handlePageChange = () => {
    const {
      conditionalTags: { loading, loadMoreTags },
    } = this.props;

    if (!loading) {
      loadMoreTags();
    }
  };

  handleRefresh = (filters = {}) => {
    history.replace({ query: { filters } });
  };

  renderTextValue = value => (
    <div className="font-weight-700">
      {value}
    </div>
  );

  renderStatus = data => (
    <StatusDropDown
      status={data.conditionStatus}
      onStatusChange={action => this.handleStatusChange(action, data.uuid)}
    />
  );

  render() {
    const { conditionalTags: data, locale } = this.props;
    const conditionalTags = get(data, 'conditionalTags.data', { content: [] });

    return (
      <Card>
        <CardHeading>
          <div className="font-size-20" id="conditional-tags-list">
            {I18n.t('route.conditionalTags.component.ConditionalTagsList.title')}
          </div>
          <Button
            className="ml-auto"
            color="secondary"
            outline
            onClick={this.handleAddTags}
          >
            {I18n.t('route.conditionalTags.component.ConditionalTagsList.addTags')}
          </Button>
        </CardHeading>
        <FilterForm onSubmit={this.handleRefresh} onReset={this.handleRefresh} />
        <CardBody>
          <GridView
            dataSource={conditionalTags.content}
            onPageChange={this.handlePageChange}
            activePage={conditionalTags.number + 1}
            locale={locale}
            totalPages={conditionalTags.totalPages}
            lazyLoad
            last={conditionalTags.last}
            showNoResults={conditionalTags.content.length === 0}
          >
            <GridViewColumn
              header={I18n.t('route.conditionalTags.component.ConditionalTagsList.name')}
              name="name"
              render={({ name }) => this.renderTextValue(name)}
            />
            <GridViewColumn
              header={I18n.t('route.conditionalTags.component.ConditionalTagsList.count')}
              render={({ count }) => this.renderTextValue(count)}
            />
            <GridViewColumn
              header={I18n.t('route.conditionalTags.component.ConditionalTagsList.tag')}
              render={({ tag }) => this.renderTextValue(tag)}
            />
            <GridViewColumn
              header={I18n.t('route.conditionalTags.component.ConditionalTagsList.status')}
              render={this.renderStatus}
            />
          </GridView>
        </CardBody>
      </Card>
    );
  }
}

export default ConditionalTagsList;
