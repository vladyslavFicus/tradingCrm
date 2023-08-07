import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Rule } from '__generated__/types';
import Placeholder from 'components/Placeholder';
import Link from 'components/Link';
import Uuid from 'components/Uuid';
import { Button, EditButton, TrashButton } from 'components';
import RulesGridFilter from 'components/RulesGridFilter';
import { Column, Table } from 'components/Table';
import infoConfig from '../constants';
import useSalesRules, { RuleInfo } from '../hooks/useSalesRules';
import './SalesRules.scss';

type Props = {
  type?: string,
  isTab?: boolean,
};

const SalesRules = (props: Props) => {
  const { type: userType, isTab } = props;

  const {
    rules,
    loading,
    refetch,
    handleOpenCreateRuleModal,
    handleOpenUpdateRuleModal,
    handleDeleteRuleClick,
    operators,
    partners,
    allowDeleteSalesRule,
    allowCreateSalesRule,
  } = useSalesRules({ type: userType });


  // ===== Renders ===== //
  const renderRule = useCallback(({ uuid, name, createdBy }: Rule) => (
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
  ), []);

  const renderRuleInfo = useCallback(({
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
  }, []);

  const renderPriority = useCallback(({ priority }: Rule) => (
    <div className="SalesRules__text-primary">{priority}</div>
  ), []);

  const renderPartner = useCallback(({ partners: rulePartners }: Rule) => (
    <Choose>
      <When condition={rulePartners.length > 0}>
        <div className="SalesRules__text-primary">
          {`${rulePartners.length} `}

          <Choose>
            <When condition={rulePartners.length === 1}>
              {I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.PARTNER')}
            </When>

            <Otherwise>
              {I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID.PARTNERS')}
            </Otherwise>
          </Choose>
        </div>
        {rulePartners.map(({ uuid, fullName }) => (
          <div key={uuid}>
            <Link to={`/partners/${uuid}`}>{fullName}</Link>
          </div>
        ))}
      </When>

      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  ), []);

  const renderActions = useCallback((rule: Rule) => (
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
  ), [handleDeleteRuleClick, handleOpenUpdateRuleModal]);

  const renderOperator = useCallback(({ operatorSpreads }: Rule) => (
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
              <Link to={`/operators/${operatorSpread?.operator?.uuid}`}>
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
  ), []);

  const renderRatio = useCallback(({ operatorSpreads }: Rule) => (
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
  ), []);

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

        <If condition={allowCreateSalesRule}>
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
        </If>
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

        <If condition={allowDeleteSalesRule}>
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
