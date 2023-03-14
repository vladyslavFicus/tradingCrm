import React from 'react';
import compose from 'compose-function';
import { Modal } from 'types';
import { withModals } from 'hoc';
import { EditButton } from 'components/Buttons';
import Uuid from 'components/Uuid';
import UpdateDistributionRuleModal from 'modals/UpdateDistributionRuleModal';
import { DistributionRuleType } from '../../DistributionRule';
import './DistributionRuleHeader.scss';

type Props = {
  distributionRule: DistributionRuleType,
  modals: {
    updateDistributionRuleModal: Modal,
  },
}

const DistributionRuleHeader = (props: Props) => {
  const {
    distributionRule: {
      uuid,
      name,
    },
    modals: { updateDistributionRuleModal },
  } = props;

  return (
    <div className="DistributionRuleHeader">
      <div
        className="DistributionRuleHeader__title"
        onClick={() => updateDistributionRuleModal.show({ uuid })}
      >
        {name}
        <EditButton className="DistributionRuleHeader__edit-icon" />
      </div>
      <Uuid uuid={uuid} uuidPrefix="RL" />
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    updateDistributionRuleModal: UpdateDistributionRuleModal,
  }),
)(DistributionRuleHeader);
