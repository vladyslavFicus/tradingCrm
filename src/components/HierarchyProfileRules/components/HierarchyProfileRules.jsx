import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';
import { branchTypes } from 'constants/hierarchyTypes';
import PropTypes from 'constants/propTypes';
import history from 'router/history';
import { actionRuleTypes, deskTypes } from 'constants/rules';
import TabHeader from '../../TabHeader';
import GridView, { GridViewColumn } from '../../GridView';
import Uuid from '../../Uuid';
import withContainer from '../containers/RuleContainer';
import RulesFilters from './RulesGridFilters';
import infoConfig from './constants';
import './HierarchyProfileRules.scss';

const HierarchyProfileRules = (title, deskType, branchType) => {
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
      deleteRuleRetention: PropTypes.func.isRequired,
      location: PropTypes.shape({
        query: PropTypes.object,
      }).isRequired,
      countries: PropTypes.object.isRequired,
      locale: PropTypes.string.isRequired,
      modals: PropTypes.shape({
        ruleModal: PropTypes.modalType,
        ruleModalRetention: PropTypes.modalType,
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
      getBranchChildren: PropTypes.object,
      getBranchInfo: PropTypes.object,
    };

    static defaultProps = {
      getBranchChildren: {},
      getBranchInfo: {},
    };

    handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } })

    handleFilterReset = () => history.replace({ query: { filters: {} } })

    triggerRuleModal = () => {
      const {
        modals: { ruleModal },
      } = this.props;

      ruleModal.show({
        onSubmit: values => this.handleAddRule(values),
        deskType,
      });
    }

    handleRenderButtonAddRule = (type) => {
      let renderButton;

      switch (type) {
        case (branchTypes.DESK): {
          const { getBranchChildren } = this.props;
          const teams = get(getBranchChildren, 'hierarchy.branchChildren.data');

          if (!getBranchChildren.loading) {
            renderButton = !!(teams && teams.length && teams.some(({ defaultUser }) => !!defaultUser));
          }
          break;
        }
        case (branchTypes.TEAM): {
          const { getBranchInfo } = this.props;
          const branchInfo = get(getBranchInfo, 'hierarchy.branchInfo.data');

          if (!getBranchInfo.loading) {
            renderButton = !!branchInfo.defaultUser;
          }
          break;
        }
        default: {
          renderButton = true;
        }
      }

      return renderButton ? this.renderButtonAddRule() : null;
    }

    handleAddRule = async (variables) => {
      const {
        notify,
        createRule,
        createRuleRetention,
        modals: { ruleModal },
        match: { params: { id } },
        auth: { uuid: createdBy },
        rules: { refetch },
      } = this.props;

      let response;
      let createRuleType = 'createRule';

      if (deskType === deskTypes.RETENTION) {
        const { ruleType, ...data } = variables;
        createRuleType = 'createRuleRetention';
        response = await createRuleRetention(
          {
            variables: {
              createdBy,
              actions: [{
                parentBranch: id,
                ruleType,
              }],
              ...data,
            },
          },
        );
      } else {
        response = await createRule(
          {
            variables: {
              createdBy,
              actions: [{
                parentBranch: id,
                ruleType: actionRuleTypes.ROUND_ROBIN,
              }],
              ...variables,
            },
          },
        );
      }

      const { data: { rules: { [createRuleType]: { data, error } } } } = response;

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
        deleteRuleRetention,
        rules: { refetch },
        modals: { deleteModal },
      } = this.props;
      let response;
      let deleteRuleType = 'deleteRule';

      if (deskType === deskTypes.RETENTION) {
        deleteRuleType = 'deleteRuleRetention';
        response = await deleteRuleRetention({ variables: { uuid } });
      } else {
        response = await deleteRule({ variables: { uuid } });
      }

      const { data: { rules: { [deleteRuleType]: { data, error } } } } = response;

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

    renderButtonAddRule = () => (
      <TabHeader title={I18n.t(title)}>
        <button
          type="submit"
          className="btn btn-sm btn-outline"
          onClick={this.triggerRuleModal}
        >
          + {I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}
        </button>
      </TabHeader>
    );

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
          rulesRetention,
          loading,
        },
        location: { query },
        countries,
        locale,
      } = this.props;
      const error = get(rules, 'error') || get(rulesRetention, 'error');

      if (error) {
        return null;
      }

      const entities = get(rules, 'data') || get(rulesRetention, 'data') || [];
      const filters = get(query, 'filters', {});

      const allowActions = Object
        .keys(filters)
        .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

      return (
        <Fragment>
          {this.handleRenderButtonAddRule(branchType)}

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

  return withContainer(RuleList, deskType, branchType);
};

export default HierarchyProfileRules;
