import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import ClientsDistributionModal from 'modals/ClientsDistributionModal';
import Uuid from 'components/Uuid';
import { EditButton } from 'components/UI';
import './DistributionRuleHeader.scss';

class DistributionRuleHeader extends PureComponent {
  static propTypes = {
    ruleUuid: PropTypes.string.isRequired,
    ruleName: PropTypes.string,
    ruleOrder: PropTypes.number,
    createdBy: PropTypes.string,
    modals: PropTypes.shape({
      updateRuleModal: PropTypes.modalType,
    }).isRequired,
    refetchRule: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ruleName: '',
    ruleOrder: null,
    createdBy: '',
  };

  showUpdateRuleModal = () => {
    const {
      ruleUuid,
      ruleName,
      ruleOrder,
      modals: {
        updateRuleModal,
      },
      refetchRule,
    } = this.props;

    updateRuleModal.show({
      action: 'UPDATE',
      uuid: ruleUuid,
      ruleName,
      ruleOrder,
      onSuccess: () => {
        refetchRule();
        updateRuleModal.hide();
      },
    });
  }

  render() {
    const {
      ruleName,
      createdBy,
    } = this.props;

    return (
      <div className="DistributionRuleHeader card-heading">
        <div
          className="DistributionRuleHeader__headline"
          onClick={this.showUpdateRuleModal}
        >
          {I18n.t('CLIENTS_DISTRIBUTION.RULE.TITLE', { name: ruleName })}
          <EditButton
            className="DistributionRuleHeader__button"
          />
        </div>
        <br />
        <If condition={createdBy}><Uuid uuid={createdBy} /></If>
      </div>
    );
  }
}

export default withModals({
  updateRuleModal: ClientsDistributionModal,
})(DistributionRuleHeader);
