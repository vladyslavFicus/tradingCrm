
import React from 'react';
import './PersonalInformationSentEmails.scss';

type Email = {
  id?: string,
  text?: string,
  subject?: string,
  name?: string,
};

type Props = {
  emails: Email[],
  onEmailClick: (email: Email) => void,
  label: string,
};

const PersonalInformationSentEmails = (props: Props) => {
  const { emails, onEmailClick, label } = props;

  return (
    <If condition={!!emails.length}>
      <div className="PersonalInformationSentEmails__emails">
        <strong>{label}:</strong>

        <div>
          {emails.map(email => (
            <span
              key={email.id}
              className="PersonalInformationSentEmails__name"
              onClick={() => onEmailClick(email)}
            >
              {email.name || email.subject}
            </span>
          ))}
        </div>
      </div>
    </If>
  );
};

export default React.memo(PersonalInformationSentEmails);
