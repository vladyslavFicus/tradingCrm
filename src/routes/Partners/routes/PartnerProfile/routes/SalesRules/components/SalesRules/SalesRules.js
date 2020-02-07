import React, { Fragment, PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { SubmissionError } from 'redux-form';
import { TextRow } from 'react-placeholder/lib/placeholders';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { actionRuleTypes, deskTypes } from 'constants/rules';
import { withPermission } from 'providers/PermissionsProvider';
import PermissionContent from 'components/PermissionContent';
import Uuid from 'components/Uuid';
import GridView from 'components/GridView';
import GridViewColumn from 'components/GridView/GridViewColumn';
import Placeholder from 'components/Placeholder';
import Permissions from 'utils/permissions';
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
    permission: PropTypes.permission.isRequired,
  };

  triggerRuleModal = () => {
    const {
      modals: { ruleModal },
    } = this.props;

    ruleModal.show({
      onSubmit: values => this.handleAddRule(values),
      deskType: deskTypes.SALES,
    });
  };

  handleAddRule = async (variables) => {
    const {
      notify,
      createRule,
      modals: { ruleModal },
      match: { params: { id } },
      rules: { refetch },
    } = this.props;

    const { data: { rules: { createRule: { data, error } } } } = await createRule(
      {
        variables: {
          actions: [{
            parentUser: id,
            ruleType: actionRuleTypes.ROUND_ROBIN,
          }],
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

      let _error = error.error;

      if (error.error === 'error.entity.already.exist') {
        _error = (
          <>
            <div>
              <Link
                to={{
                  pathname: '/sales-rules',
                  query: { filters: { createdByOrUuid: error.errorParameters.ruleUuid } },
                }}
              >
                {I18n.t(`rules.${error.error}`, error.errorParameters)}
              </Link>
            </div>
            <Uuid uuid={error.errorParameters.ruleUuid} uuidPrefix="RL" />
          </>
        );
      }

      throw new SubmissionError({ _error });
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
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const entities = get(rules, 'data') || [];

    const isDeleteRuleAvailable = (new Permissions(permissions.SALES_RULES.REMOVE_RULE)).check(currentPermissions);

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
          <PermissionContent permissions={permissions.SALES_RULES.CREATE_RULE}>
            <div className="ml-auto">
              <button
                id="add-rule"
                type="submit"
                className="btn btn-sm btn-outline"
                onClick={this.triggerRuleModal}
              >
                + {I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}
              </button>
            </div>
          </PermissionContent>
        </div>

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
            <If condition={isDeleteRuleAvailable}>
              <GridViewColumn
                name="delete"
                header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.ACTION')}
                render={this.renderRemoveIcon}
              />
            </If>
          </GridView>
        </div>
      </div>
    );
  }
}

export default withPermission(SalesRules);
