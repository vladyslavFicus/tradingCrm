import React from 'react';
import { Utils } from '@crm/common';
import './EmailPreview.scss';

type Props = {
  label: string,
  text: string,
  templatePreview?: boolean,
  firstName?: string,
  lastName?: string,
};

const EmailPreview = (props: Props) => {
  const {
    label,
    text,
    templatePreview,
    firstName = '',
    lastName = '',
  } = props;

  return (
    <>
      <label className="EmailPreview__label">{label}</label>

      <div
        className="EmailPreview__body"
        dangerouslySetInnerHTML={{
          __html: templatePreview ? Utils.injectName(firstName, lastName, text) : text,
        }}
      />
    </>
  );
};

export default React.memo(EmailPreview);
