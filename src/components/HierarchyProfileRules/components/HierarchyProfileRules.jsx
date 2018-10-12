import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';
import PropTypes from '../../../constants/propTypes';
import history from '../../../router/history';
import { actionRuleTypes } from '../../../constants/rules';
import TabHeader from '../../TabHeader';
import GridView, { GridViewColumn } from '../../GridView';
import Uuid from '../../Uuid';
import withContainer from '../containers/RuleContainer';
import RulesFilters from './RulesGridFilters';
import infoConfig from './constants';
import './HierarchyProfileRules.scss';

const HierarchyProfileRules = (title) => {
  class RuleList extends Component {
    static propTypes = {
      rules: PropTypes.shape({
        rules: PropTypes.shape({
          data: PropTypes.arrayOf(PropTypes.ruleType),
          error: PropTypes.object,
        }),
        refetch: PropTypes.func.isRequired,
      }).isRequired,
      createRule: PropTypes.func.isRequired,
      deleteRule: PropTypes.func.isRequired,
      location: PropTypes.shape({
        query: PropTypes.object,
      }).isRequired,
      countries: PropTypes.object.isRequired,
      locale: PropTypes.string.isRequired,
      modals: PropTypes.shape({
        ruleModal: PropTypes.modalType,
        deleteModal: PropTypes.modalType,
      }).isRequired,
      match: PropTypes.shape({
        params: PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
      auth: PropTypes.shape({
        uuid: PropTypes.string.isRequired,
      }).isRequired,
    };

    handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } })

    handleFilterReset = () => history.replace({ query: { filters: {} } })

    triggerRuleModal = () => {
      const {
        modals: { ruleModal },
      } = this.props;

      ruleModal.show({
        onSubmit: values => this.handleAddRule(values),
      });
    }

    handleAddRule = async (variables) => {
      const {
        notify,
        createRule,
        modals: { ruleModal },
        match: { params: { id } },
        auth: { uuid: createdBy },
        rules: { refetch },
      } = this.props;

      const action = {
        parentBranch: id,
        ruleType: actionRuleTypes.DEFAULT,
      };
      const { data: { rules: { createRule: { data, error } } } } = await createRule(
        {
          variables: {
            createdBy,
            actions: [action],
            ...variables,
          },
        },
      );

      if (error) {
        notify({
          level: 'error',
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_CREATED'),
        });
        throw new SubmissionError({ _error: error.error });
      } else {
        await refetch();
        ruleModal.hide();
        notify({
          level: 'success',
          title: I18n.t('COMMON.SUCCESS'),
          message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_CREATED', { id: data.uuid }),
        });
      }
    };

    handleDeleteRule = uuid => async () => {
      const {
        notify,
        deleteRule,
        rules: { refetch },
        modals: { deleteModal },
      } = this.props;

      const { data: { rules: { deleteRule: { data, error } } } } = await deleteRule({ variables: { uuid } });

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
    }

    handleDeleteRuleClick = (uuid) => {
      const {
        modals: { deleteModal },
        rules: { rules: { data } },
      } = this.props;
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
        <div className="font-size-11">
          <Uuid uuid={uuid} uuidPrefix="RL" />
        </div>
        <div className="font-size-11">
          <Uuid uuid={createdBy} uuidPrefix="OP" />
        </div>
      </Fragment>
    );

    renderRuleInfo = ({
      fieldName,
      translateMultiple,
      translateSingle,
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
            {arr.join(' ').toUpperCase()}
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
        countries,
        locale,
      } = this.props;
      const error = get(rules, 'error');

      if (error) {
        return null;
      }

      const entities = get(rules, 'data') || [];
      const filters = get(query, 'filters', {});

      const allowActions = Object
        .keys(filters)
        .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

      return (
        <Fragment>
          <TabHeader title={I18n.t(title)}>
            <button
              type="submit"
              className="btn btn-sm btn-outline"
              onClick={this.triggerRuleModal}
            >
              + {I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}
            </button>
          </TabHeader>

          <RulesFilters
            onSubmit={this.handleFiltersChanged}
            onReset={this.handleFilterReset}
            disabled={!allowActions || error}
            countries={countries}
          />

          <div className="card-body">
            <GridView
              dataSource={entities}
              last
              locale={locale}
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
        </Fragment>
      );
    }
  }

  return withContainer(RuleList);
};

export default HierarchyProfileRules;
