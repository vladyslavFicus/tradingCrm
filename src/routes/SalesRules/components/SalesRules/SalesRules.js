import React, { Fragment, PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { TextRow } from 'react-placeholder/lib/placeholders';
import history from 'router/history';
import PropTypes from 'constants/propTypes';
import countries from 'utils/countryList';
import Uuid from 'components/Uuid';
import RulesFilters from 'components/HierarchyProfileRules/components/RulesGridFilters';
import GridView from 'components/GridView';
import GridViewColumn from 'components/GridView/GridViewColumn';
import Placeholder from 'components/Placeholder';
import infoConfig from './constants';

class SalesRules extends PureComponent {
  static propTypes = {
    rules: PropTypes.shape({
      rules: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.ruleType),
        error: PropTypes.object,
      }),
      refetch: PropTypes.func.isRequired,
    }).isRequired,
    deleteRule: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      deleteModal: PropTypes.modalType,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.object,
    }).isRequired,
  };

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  handleDeleteRule = uuid => async () => {
    const {
      notify,
      deleteRule,
      rules: { refetch },
      modals: { deleteModal },
    } = this.props;

    const response = await deleteRule({ variables: { uuid } });

    const { data: { rules: { deleteRule: { data, error } } } } = response;

    if (error) {
      deleteModal.hide();
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_DELETED'),
      });
    } else {
      await refetch();
      deleteModal.hide();
      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_DELETED', { id: data.uuid }),
      });
    }
  };

  handleDeleteRuleClick = (uuid) => {
    const {
      modals: { deleteModal },
      rules: { rules, rulesRetention },
    } = this.props;

    const data = get(rules, 'data') || get(rulesRetention, 'data') || [];

    const { name } = data.find(({ uuid: ruleId }) => ruleId === uuid);

    deleteModal.show({
      onSubmit: this.handleDeleteRule(uuid),
      modalTitle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.HEADER'),
      actionText: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.ACTION_TEXT', { name }),
      submitButtonLabel: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.DELETE'),
    });
  };

  renderRule = ({ uuid, name, createdBy }) => (
    <Fragment>
      <div className="font-weight-700">
        {name}
      </div>
      <If condition={uuid}>
        <div className="font-size-11">
          <Uuid uuid={uuid} uuidPrefix="RL" />
        </div>
      </If>
      <If condition={createdBy}>
        <div className="font-size-11">
          <Uuid uuid={createdBy} uuidPrefix="OP" />
        </div>
      </If>
    </Fragment>
  );

  renderRuleInfo = ({
    fieldName,
    translateMultiple,
    translateSingle,
    withUpperCase,
  }) => ({ [fieldName]: arr }) => (
    <Choose>
      <When condition={arr.length > 0}>
        <div className="font-weight-700">
          {`${arr.length} `}
          <Choose>
            <When condition={arr.length === 1}>
              {I18n.t(translateSingle)}
            </When>
            <Otherwise>
              {I18n.t(translateMultiple)}
            </Otherwise>
          </Choose>
        </div>
        <div className="font-size-12">
          {withUpperCase ? arr.join(', ').toUpperCase() : arr.join(', ')}
        </div>
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderPriority = ({ priority }) => (
    <div className="font-weight-700">
      {priority}
    </div>
  );

  renderPartner = ({ partners }) => (
    <Choose>
      <When condition={partners.length > 0}>
        <div className="font-weight-700">
          {`${partners.length} `}
          <Choose>
            <When condition={partners.length === 1}>
              {I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.PARTNER')}
            </When>
            <Otherwise>
              {I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.PARTNERS')}
            </Otherwise>
          </Choose>
        </div>
        {partners.map(({ uuid, fullName }) => (
          <div key={uuid}>
            <Link to={`/partners/${uuid}/profile`}>{fullName}</Link>
          </div>
        ))}
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderRemoveIcon = ({ uuid }) => (
    <button
      type="button"
      className="fa fa-trash btn-transparent color-danger"
      onClick={() => this.handleDeleteRuleClick(uuid)}
    />
  );

  render() {
    const {
      rules: {
        rules,
        loading,
      },
      location: { query },
    } = this.props;

    const entities = get(rules, 'data') || [];
    const filters = get(query, 'filters', {});

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Placeholder
            ready={!loading}
            className={null}
            customPlaceholder={(
              <div>
                <TextRow className="animated-background" style={{ width: '220px', height: '20px' }} />
              </div>
            )}
          >
            <span className="font-size-20">
              {entities.length} {I18n.t('SALES_RULES.TITLE')}
            </span>
          </Placeholder>
        </div>
        <RulesFilters
          initialValues={filters}
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          countries={countries}
        />

        <div className="card-body">
          <GridView
            dataSource={entities}
            last
            showNoResults={!loading && entities.length === 0}
            onRowClick={this.handleOfficeClick}
          >
            <GridViewColumn
              name="rule"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.RULE')}
              render={this.renderRule}
            />
            <GridViewColumn
              name="countries"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.COUNTRY')}
              render={this.renderRuleInfo(infoConfig.countries)}
            />
            <GridViewColumn
              name="languages"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.LANGUAGE')}
              render={this.renderRuleInfo(infoConfig.languages)}
            />
            <GridViewColumn
              name="partners"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PARTNER')}
              render={this.renderPartner}
            />
            <GridViewColumn
              name="sources"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.SOURCE')}
              render={this.renderRuleInfo(infoConfig.sources)}
            />
            <GridViewColumn
              name="priority"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PRIORITY')}
              render={this.renderPriority}
            />
            <GridViewColumn
              name="delete"
              header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.ACTION')}
              render={this.renderRemoveIcon}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default SalesRules;
