import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import EventEmitter, { DISTRIBUTION_RULE_CHANGED } from 'utils/EventEmitter';
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
    } = this.props;

    updateRuleModal.show({
      action: 'UPDATE',
      uuid: ruleUuid,
      ruleName,
      ruleOrder,
      onSuccess: () => {
        EventEmitter.emit(DISTRIBUTION_RULE_CHANGED);
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
