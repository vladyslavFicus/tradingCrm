import React from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { useLocation, useParams } from 'react-router-dom';
import { State } from 'types';
import { Operator, Partner, Rule } from '__generated__/types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import { notify, LevelType } from 'providers/NotificationProvider';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import CreateRuleModal, { CreateRuleModalProps } from 'modals/CreateRuleModal';
import UpdateRuleModal, { UpdateRuleModalProps } from 'modals/UpdateRuleModal';
import Placeholder from 'components/Placeholder';
import { Link } from 'components/Link';
import Uuid from 'components/Uuid';
import PermissionContent from 'components/PermissionContent';
import { Button, EditButton, TrashButton } from 'components/Buttons';
import { Table, Column } from 'components/Table';
import RulesGridFilter from 'components/HierarchyProfileRules/components/RulesGridFilters/RulesGridFilter';
import { OperatorsQueryVariables, useOperatorsQuery } from '../graphql/__generated__/OperatorsQuery';
import { usePartnersQuery } from '../graphql/__generated__/PartnersQuery';
import { useDeleteRule } from '../graphql/__generated__/DeleteRuleMutation';
import { RulesQueryVariables, useRulesQuery } from '../graphql/__generated__/RulesQuery';
import infoConfig, { OPERATORS_SORT } from './constants';
import './SalesRules.scss';

type RuleInfo = {
  fieldName: string,
  translateMultiple: string,
  translateSingle: string,
  withUpperCase?: boolean,
};

type Props = {
  type?: string,
  isTab?: boolean,
};

const SalesRules = (props: Props) => {
  const { type: userType, isTab } = props;

  const { id: parentBranch } = useParams<{ id: string }>();

  const { state } = useLocation<State>();

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const createRuleModal = useModal<CreateRuleModalProps>(CreateRuleModal);
  const updateRuleModal = useModal<UpdateRuleModalProps>(UpdateRuleModal);

  // ===== Requests ===== //
  const [deleteRule] = useDeleteRule();

  const rulesQuery = useRulesQuery({
    variables: {
      ...state?.filters as RulesQueryVariables,
      ...(userType === 'PARTNER' && { affiliateId: parentBranch || '' }),
      ...(userType === 'OPERATOR' && { operatorUuids: parentBranch || '' }),
    },
    fetchPolicy: 'cache-and-network',
  });
  const { data, refetch, loading } = rulesQuery;
  const rules = data?.rules || [];

  const operatorsQuery = useOperatorsQuery({
    variables: {
      ...state?.filters as OperatorsQueryVariables,
      page: {
        from: 0,
        size: 1000,
        sorts: OPERATORS_SORT,
      },
    },
  });

  const partnersQuery = usePartnersQuery();

  // ===== Handlers ===== //
  const handleOpenCreateRuleModal = () => {
    createRuleModal.show({
      parentBranch,
      userType,
      withOperatorSpreads: true,
      onSuccess: async () => {
        await refetch();
        createRuleModal.hide();
      },
    });
  };

  const handleOpenUpdateRuleModal = ({ uuid }: Rule) => {
    updateRuleModal.show({
      uuid,
      onSuccess: async () => {
        await refetch();
        updateRuleModal.hide();
      },
    });
  };

  const handleDeleteRule = (uuid: string) => async () => {
    try {
      await deleteRule({ variables: { uuid } });

      await refetch();

      confirmActionModal.hide();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_DELETED'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('HIERARCHY.PROFILE_RULE_TAB.RULE_NOT_DELETED'),
      });
    }
  };

  const handleDeleteRuleClick = ({ uuid }: Rule) => {
    const result = rules.find(rule => rule?.uuid === uuid);
    const name = result?.name;

    confirmActionModal.show({
      onSubmit: handleDeleteRule(uuid),
      modalTitle: I18n.t('HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.HEADER'),
      actionText: I18n.t(
        'HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.ACTION_TEXT',
        { name },
      ),
      submitButtonLabel: I18n.t(
        'HIERARCHY.PROFILE_RULE_TAB.DELETE_MODAL.DELETE',
      ),
    });
  };

  // ===== Renders ===== //
  const renderRule = ({ uuid, name, createdBy }: Rule) => (
    <>
      <div className="SalesRules__text-primary">{name}</div>

      <If condition={!!uuid}>
        <div className="SalesRules__uuid SalesRules__text-secondary">
          <Uuid uuid={uuid} uuidPrefix="RL" />
        </div>
      </If>

      <If condition={!!createdBy}>
        <div className="SalesRules__uuid SalesRules__text-secondary">
          <Uuid uuid={createdBy || ''} uuidPrefix="OP" />
        </div>
      </If>
    </>
  );

  const renderRuleInfo = ({
    fieldName,
    translateSingle,
    translateMultiple,
    withUpperCase,
  }: RuleInfo) => (row: Rule) => {
    const arr = row[fieldName as keyof Rule] as Array<string>;

    return (
      <Choose>
        <When condition={arr.length > 0}>
          <div className="SalesRules__text-primary">
            {`${arr.length} `}

            <Choose>
              <When condition={arr.length === 1}>
                {I18n.t(translateSingle)}
              </When>

              <Otherwise>{I18n.t(translateMultiple)}</Otherwise>
            </Choose>
          </div>

          <div className="SalesRules__text-secondary">
            {withUpperCase ? arr.join(', ').toUpperCase() : arr.join(', ')}
          </div>
        </When>

        <Otherwise>
          <span>&mdash;</span>
        </Otherwise>
      </Choose>
    );
  };

  const renderPriority = ({ priority }: Rule) => (
    <div className="SalesRules__text-primary">{priority}</div>
  );

  const renderPartner = ({ partners }: Rule) => (
    <Choose>
      <When condition={partners.length > 0}>
        <div className="SalesRules__text-primary">
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

  const renderActions = (rule: Rule) => (
    <>
      <TrashButton
        data-testid="SalesRules-trashButton"
        onClick={() => handleDeleteRuleClick(rule)}
      />

      <EditButton
        className="SalesRules__edit-button"
        data-testid="SalesRules-editButton"
        onClick={() => handleOpenUpdateRuleModal(rule)}
      />
    </>
  );

  const renderOperator = ({ operatorSpreads }: Rule) => (
    <Choose>
      <When condition={!!operatorSpreads && operatorSpreads.length > 0}>
        <div className="SalesRules__text-primary">
          {`${operatorSpreads?.length} `}

          <Choose>
            <When condition={operatorSpreads?.length === 1}>
              {I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.OPERATOR')}
            </When>

            <Otherwise>
              {I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.OPERATORS')}
            </Otherwise>
          </Choose>
        </div>

        {operatorSpreads?.map(operatorSpread => (
          <If condition={!!operatorSpread?.operator}>
            <div key={operatorSpread?.operator?.uuid}>
              <Link to={`/operators/${operatorSpread?.operator?.uuid}/profile`}>
                {operatorSpread?.operator?.fullName}
              </Link>
            </div>
          </If>
        ))}
      </When>

      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  const renderRatio = ({ operatorSpreads }: Rule) => (
    <Choose>
      <When condition={!!operatorSpreads && operatorSpreads.length > 0}>
        <div className="SalesRules__ratio">
          {operatorSpreads?.map(operatorSpread => (
            <If condition={!!operatorSpread?.operator}>
              <div key={operatorSpread?.operator?.uuid}>
                <div className="SalesRules__text-primary">
                  <Choose>
                    <When condition={!!operatorSpread?.percentage}>
                      <span>{operatorSpread?.percentage} %</span>
                    </When>

                    <Otherwise>
                      &mdash;
                    </Otherwise>
                  </Choose>
                </div>
              </div>
            </If>
          ))}
        </div>
      </When>

      <Otherwise>
        &mdash;
      </Otherwise>
    </Choose>
  );

  const operators = (operatorsQuery.data?.operators?.content as Operator[]) || [];
  const partners = (partnersQuery.data?.partners?.content as Partner[]) || [];

  const permission = usePermission();
  const isDeleteRuleAvailable = permission.allows(
    permissions.SALES_RULES.REMOVE_RULE,
  );

  return (
    <div
      className={classNames('SalesRules', { 'SalesRules--no-borders': isTab })}
    >
      <div className="SalesRules__header">
        <Placeholder ready={!loading} rows={[{ width: 220, height: 20 }]}>
          <span>
            <strong>{rules.length} </strong>
            {I18n.t('SALES_RULES.TITLE')}
          </span>
        </Placeholder>

        <PermissionContent permissions={permissions.SALES_RULES.CREATE_RULE}>
          <Button
            id="add-rule"
            type="submit"
            small
            tertiary
            onClick={handleOpenCreateRuleModal}
            data-testid="SalesRules-addRuleButton"
          >
            {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
          </Button>
        </PermissionContent>
      </div>

      <RulesGridFilter
        handleRefetch={refetch}
        partners={partners}
        operators={operators}
        type={userType}
      />

      <Table stickyFromTop={126} items={rules} loading={loading}>
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.RULE')}
          render={renderRule}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.COUNTRY')}
          render={renderRuleInfo(infoConfig.countries)}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PRIORITY')}
          render={renderPriority}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.LANGUAGE')}
          render={renderRuleInfo(infoConfig.languages)}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PARTNER')}
          render={renderPartner}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.OPERATOR')}
          render={renderOperator}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.RATIO')}
          render={renderRatio}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.SOURCE')}
          render={renderRuleInfo(infoConfig.sources)}
        />

        <If condition={isDeleteRuleAvailable}>
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.ACTION')}
            render={renderActions}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(SalesRules);
