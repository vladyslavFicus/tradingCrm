import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Uuid from 'components/Uuid';
import './FailureReasonIcon.scss';

type Props = {
  reason: string,
  statusAuthor: string,
  id?: string,
  statusDate?: string,
  profileStatusComment?: string,
};

const FailureReasonIcon = (props: Props) => {
  const {
    id = 'failure-reason-id',
    reason,
    statusDate,
    statusAuthor,
    profileStatusComment,
  } = props;
  const [isOpenPopover, setIsOpenPopover] = useState<boolean>(false);

  const handleTogglePopover = () => {
    setIsOpenPopover(!isOpenPopover);
  };

  return (
    <>
      <button
        id={id}
        type="button"
        className="FailureReasonIcon"
        onClick={handleTogglePopover}
      />

      <Popover
        container=".FailureReasonIcon"
        className="FailureReasonIcon__popover"
        placement="right"
        isOpen={isOpenPopover}
        target={id}
        toggle={handleTogglePopover}
        trigger="legacy"
      >
        <PopoverHeader tag="div" className="FailureReasonIcon__popover-header">
          <div className="FailureReasonIcon__popover-title">
            {I18n.t('COMMON.AUTHOR_BY')}

            <If condition={!!statusAuthor}>
              <Uuid
                uuid={statusAuthor}
                uuidPrefix="OP"
                className="FailureReasonIcon__popover-primary-text"
              />
            </If>
          </div>

          <If condition={!!statusDate}>
            <div className="FailureReasonIcon__popover-date">
              {statusDate}
            </div>
          </If>
        </PopoverHeader>

        <PopoverBody className="FailureReasonIcon__popover-body">
          <div>
            <span className="FailureReasonIcon__popover-primary-text">{I18n.t('COMMON.REASON')}: </span>
            {I18n.t(reason)}
          </div>

          <If condition={!!profileStatusComment}>
            <div>
              <span className="FailureReasonIcon__popover-primary-text">{I18n.t('COMMON.COMMENT')}: </span>
              {profileStatusComment}
            </div>
          </If>
        </PopoverBody>
      </Popover>
    </>
  );
};

export default React.memo(FailureReasonIcon);
