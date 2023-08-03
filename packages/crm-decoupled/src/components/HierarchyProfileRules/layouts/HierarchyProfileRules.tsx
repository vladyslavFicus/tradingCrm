import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import { Rule } from '__generated__/types';
import { Button, EditButton, TrashButton } from 'components/Buttons';
import { Column, Table } from 'components/Table';
import TabHeader from 'components/TabHeader';
import Uuid from 'components/Uuid';
import Link from 'components/Link';
import RulesGridFilter from 'components/RulesGridFilter';
import infoConfig from '../constants';
import useHierarchyProfileRules, { RuleInfo } from '../hooks/useHierarchyProfileRules';
import './HierarchyProfileRules.scss';

type Props = {
  branchId: string,
  title: string,
};

const HierarchyProfileRules = (props: Props) => {
  const { branchId, title } = props;

  const {
    refetch,
    rules,
    loading,
    error,
    handleOpenCreateRuleModal,
    handleOpenUpdateRuleModal,
    handleDeleteRuleClick,
    isCreateRuleAllow,
    isDeleteRuleAllow,
  } = useHierarchyProfileRules({ branchId });

  if (error) {
    return null;
  }

  // ===== Renders ===== //
  const renderRule = useCallback(({ uuid, name, createdBy }: Rule) => (
    <div className="HierarchyProfileRules__rule">
      <div className="HierarchyProfileRules__rule-name">
        {name}
      </div>

      <If condition={!!uuid}>
        <div className="HierarchyProfileRules__rule-uuid">
          <Uuid uuid={uuid} uuidPrefix="RL" />
        </div>
      </If>

      <If condition={!!createdBy}>
        <div className="HierarchyProfileRules__rule-uuid">
          <Uuid uuid={createdBy || ''} uuidPrefix="OP" />
        </div>
      </If>
    </div>
  ), []);

  const renderRuleInfo = useCallback((
    { fieldName, translateSingle, translateMultiple, withUpperCase }: RuleInfo,
  ) => (row: Rule) => {
    const arr = row[fieldName as keyof Rule] as Array<string>;

    return (
      <Choose>
        <When condition={arr?.length > 0}>
          <div className="HierarchyProfileRules__info">
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

          <div className="HierarchyProfileRules__info-text">
            {withUpperCase ? arr.join(', ').toUpperCase() : arr.join(', ')}
          </div>
        </When>

        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderPriority = useCallback((rule: Rule) => {
    const { priority } = rule;

    return (
      <div className="HierarchyProfileRules__priority">
        {priority}
      </div>
    );
  }, []);

  const renderPartner = useCallback((rule: Rule) => {
    const { partners } = rule;

    return (
      <Choose>
        <When condition={partners.length > 0}>
          <div className="HierarchyProfileRules__partner">
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

          {partners.map(partner => (
            <If condition={!!partner}>
              <div key={partner.uuid}>
                <Link to={`/partners/${partner.uuid}`}>{partner.fullName}</Link>
              </div>
            </If>
          ))}
        </When>

        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderActions = useCallback((rule: Rule) => (
    <>
      <TrashButton
        data-testid="HierarchyProfileRules-trashButton"
        onClick={() => handleDeleteRuleClick(rule)}
      />

      <EditButton
        data-testid="HierarchyProfileRules-editRuleButton"
        onClick={() => handleOpenUpdateRuleModal(rule)}
        className="HierarchyProfileRules__edit-icon"
      />
    </>
  ), []);

  return (
    <div className="HierarchyProfileRules">
      <TabHeader
        title={title}
        className="HierarchyProfileRules__header"
      >
        <If condition={isCreateRuleAllow}>
          <Button
            data-testid="HierarchyProfileRules-addRuleButton"
            type="submit"
            onClick={handleOpenCreateRuleModal}
            tertiary
            small
          >
            {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
          </Button>
        </If>
      </TabHeader>

      <RulesGridFilter
        handleRefetch={refetch}
      />

      <Table
        stickyFromTop={112}
        items={rules}
        loading={loading}
      >
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.RULE')}
          render={renderRule}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.COUNTRY')}
          render={renderRuleInfo(infoConfig.countries)}
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
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.SOURCE')}
          render={renderRuleInfo(infoConfig.sources)}
        />
        <Column
          header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.PRIORITY')}
          render={renderPriority}
        />

        <If condition={isDeleteRuleAllow}>
          <Column
            header={I18n.t('HIERARCHY.PROFILE_RULE_TAB.GRID_HEADER.ACTION')}
            render={renderActions}
          />
        </If>
      </Table>
    </div>
  );
};

export default React.memo(HierarchyProfileRules);
