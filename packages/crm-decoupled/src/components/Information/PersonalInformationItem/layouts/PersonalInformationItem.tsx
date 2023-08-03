import React from 'react';
import classNames from 'classnames';
import { ReactComponent as EmailSVG } from 'components/Information/PersonalInformationItem/icons/email.svg';
import './PersonalInformationItem.scss';

type Props = {
  label: string,
  value: React.ReactNode,
  additional?: React.ReactNode,
  verified?: boolean,
  className?: string,
  withSendEmail?: boolean,
  onClickSelectEmail?: () => void,
  onClickValue?: () => void,
};

const PersonalInformationItem = (props: Props) => {
  const {
    label,
    value,
    additional,
    verified,
    className,
    withSendEmail,
    onClickSelectEmail,
    onClickValue,
  } = props;

  return (
    <div className={classNames('PersonalInformationItem', className)}>
      <div className="PersonalInformationItem__content">
        <strong>{label}</strong>: <span onClick={onClickValue}>{value}</span>

        <If condition={!!verified}>
          <i className="fa fa-check text-success" />
        </If>
      </div>

      <If condition={!!additional}>
        <div className="PersonalInformationItem__additional">
          {additional}

          <If condition={!!withSendEmail}>
            <EmailSVG onClick={onClickSelectEmail} />
          </If>
        </div>
      </If>
    </div>
  );
};

export default React.memo(PersonalInformationItem);
