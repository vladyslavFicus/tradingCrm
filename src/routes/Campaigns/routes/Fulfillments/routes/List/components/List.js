import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../constants/propTypes';
import Card, { Title, Content } from '../../../../../../../components/Card';
import GridView, { GridColumn } from '../../../../../../../components/GridView';
import Amount from '../../../../../../../components/Amount';

class List extends Component {
  static propTypes = {
    wageringFulfillments: PropTypes.shape({
      entities: PropTypes.arrayOf(PropTypes.wageringFulfillmentEntity),
      noResults: PropTypes.bool,
    }).isRequired,
    deleteEntity: PropTypes.func.isRequired,
    fetchEntities: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.props.fetchEntities();
  }

  handleDelete = uuid => async () => {
    const { deleteEntity, fetchEntities } = this.props;

    const action = await deleteEntity(uuid);

    if (action && !action.error) {
      fetchEntities();
    }
  };

  renderUUID = ({ uuid, amounts }) => (
    <div>
      {uuid}
      <ul>
        {amounts.map(amount => (<li key={amount.currency}><Amount {...amount} /></li>))}
      </ul>
    </div>
  );

  renderActions = ({ uuid }) => (
    <div>
      <button
        onClick={this.handleDelete(uuid)}
        className="btn btn-danger"
        type="button"
      >{I18n.t('COMMON.REMOVE')}
      </button>
    </div>
  );

  render() {
    const {
      wageringFulfillments: { entities, noResults },
      locale,
    } = this.props;

    return (
      <Card>
        <Title>
          <span className="font-size-20 mr-auto">
            {I18n.t('CAMPAIGNS.WAGERING_FULFILLMENTS.LIST.TITLE')}
          </span>
          <Link
            className="btn btn-primary-outline"
            to="/campaigns/fulfillments/create"
          >
            {I18n.t('CAMPAIGNS.WAGERING_FULFILLMENTS.LIST.CREATE_BUTTON')}
          </Link>
        </Title>
        <Content>
          <GridView
            dataSource={entities}
            totalPages={1}
            locale={locale}
            showNoResults={noResults}
          >
            <GridColumn
              name="uuid"
              header="ID"
              render={this.renderUUID}
            />
            <GridColumn
              name="actions"
              header="Actions"
              render={this.renderActions}
            />
          </GridView>
        </Content>
      </Card>
    );
  }
}

export default List;
