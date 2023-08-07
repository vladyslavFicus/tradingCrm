import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import Placeholder from 'components/Placeholder';
import useDistributionRuleList from 'routes/DistributionRules/hooks/useDistributionRulesList';
import DistributionRulesGrid from './components/DistributionRulesGrid';
import DistributionRulesGridFilters from './components/DistributionRulesGridFilters';
import './DistributionRuleList.scss';

const DistributionRuleList = () => {
  const {
    allowCreateRule,
    content,
    last,
    totalElements,
    loading,
    refetch,
    handlePageChanged,
    handleCreateRule,
  } = useDistributionRuleList();

  return (
    <div className="DistributionRulesList">
      <div className="DistributionRulesList__header">
        <Placeholder ready={!loading} rows={[{ width: 220, height: 20 }]}>
          <span>
            <strong>{totalElements} </strong>

            {I18n.t('CLIENTS_DISTRIBUTION.TITLE')}
          </span>
        </Placeholder>

        <If condition={allowCreateRule}>
          <Button
            small
            tertiary
            onClick={handleCreateRule}
            data-testid="DistributionRuleList-addRuleButton"
          >
            {`+ ${I18n.t('HIERARCHY.PROFILE_RULE_TAB.ADD_RULE')}`}
          </Button>
        </If>
      </div>

      <DistributionRulesGridFilters onRefetch={refetch} />

      <DistributionRulesGrid
        content={content}
        loading={loading}
        last={last}
        onRefetch={refetch}
        onMore={handlePageChanged}
      />
    </div>
  );
};

export default React.memo(DistributionRuleList);
