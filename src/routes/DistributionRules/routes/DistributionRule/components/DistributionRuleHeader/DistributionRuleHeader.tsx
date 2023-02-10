import React from 'react';
import compose from 'compose-function';
import { Modal } from 'types';
import { withModals } from 'hoc';
import { EditButton } from 'components/Buttons';
import Uuid from 'components/Uuid';
import { DistributionRuleType } from '../../DistributionRule';
import EditRuleNameModal from '../../modals/EditRuleNameModal';
import './DistributionRuleHeader.scss';

type EditRuleNameModalProps = {
  uuid: string,
}

type Props = {
  distributionRule: DistributionRuleType,
  modals: {
    editRuleNameModal: Modal<EditRuleNameModalProps>,
  },
}

const DistributionRuleHeader = (props: Props) => {
  const {
    distributionRule: {
      uuid,
      name,
    },
    modals: { editRuleNameModal },
  } = props;

  return (
    <div className="DistributionRuleHeader">
      <div
        className="DistributionRuleHeader__title"
        onClick={() => editRuleNameModal.show({ uuid })}
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
    editRuleNameModal: EditRuleNameModal,
  }),
)(DistributionRuleHeader);
