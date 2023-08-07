import React from 'react';
import { EditButton } from 'components';
import Uuid from 'components/Uuid';
import { useModal } from 'providers/ModalProvider';
import UpdateDistributionRuleModal, { UpdateDistributionRuleModalProps } from 'modals/UpdateDistributionRuleModal';
import { DistributionRuleType } from 'routes/DistributionRules/hooks/useDistributionRule';
import './DistributionRuleHeader.scss';

type Props = {
  distributionRule: DistributionRuleType,
};

const DistributionRuleHeader = (props: Props) => {
  const {
    distributionRule: {
      uuid,
      name,
    },
  } = props;

  const updateDistributionRuleModal = useModal<UpdateDistributionRuleModalProps>(UpdateDistributionRuleModal);

  return (
    <div className="DistributionRuleHeader">
      <div
        className="DistributionRuleHeader__title"
        onClick={() => updateDistributionRuleModal.show({ uuid })}
      >
        {name}
        <EditButton
          className="DistributionRuleHeader__edit-icon"
          data-testid="DistributionRuleHeader-editButton"
        />
      </div>
      <Uuid uuid={uuid} uuidPrefix="RL" />
    </div>
  );
};

export default React.memo(DistributionRuleHeader);
