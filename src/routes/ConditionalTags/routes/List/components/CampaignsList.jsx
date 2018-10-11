import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { GridView, GridViewColumn, Card, CardBody, CardHeading, Button } from '@newage/casino_backoffice_ui';
import FilterForm from './FilterForm';

class ConditionalTagsList extends Component {
  renderTextValue = data => (
    <div className="font-weight-700">
      {data.name}
    </div>
  );

  handleAddTags = () => {
    const {
      conditionalTags: { refetch },
      modals: { addTags },
    } = this.props;

    addTags.show({ onConfirm: refetch});
  };

  render() {
    const { conditionalTags: data } = this.props;
    const conditionalTags = get(data, 'conditionalTags', { content: [] });

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
        <FilterForm />
        <CardBody>
          <GridView
            dataSource={conditionalTags.content}
            onPageChange={this.handlePageChange}
            activePage={conditionalTags.number + 1}
            totalPages={conditionalTags.totalPages}
            lazyLoad
            last={conditionalTags.last}
            showNoResults={conditionalTags.content.length === 0}
          >
            <GridViewColumn
              header={I18n.t('route.conditionalTags.component.ConditionalTagsList.name')}
              name="name"
              render={this.renderTextValue}
            />
            <GridViewColumn
              header={I18n.t('route.conditionalTags.component.ConditionalTagsList.count')}
              render={({ count }) => count}
            />
            <GridViewColumn
              header={I18n.t('route.conditionalTags.component.ConditionalTagsList.tag')}
              render={({ tag }) => tag}
            />
            <GridViewColumn
              header={I18n.t('route.conditionalTags.component.ConditionalTagsList.status')}
              render={({ conditionStatus }) => conditionStatus}
            />
          </GridView>
        </CardBody>
      </Card>
    );
  }
}

export default ConditionalTagsList;
