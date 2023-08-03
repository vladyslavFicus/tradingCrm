import React from 'react';
import { injectName } from 'utils/injectName';
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
          __html: templatePreview ? injectName(firstName, lastName, text) : text,
        }}
      />
    </>
  );
};

export default React.memo(EmailPreview);
