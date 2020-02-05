import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import './PersonalInformationSentEmails.scss';

class PersonalInformationSentEmails extends PureComponent {
  propTypes = {
    emails: PropTypes.arrayOf(PropTypes.email).isRequired,
    onEmailClick: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
  };

  render() {
    const { emails, onEmailClick, label } = this.props;

    return (
      <If condition={emails}>
        <div className="PersonalInformationSentEmails__emails">
          <span>
            <strong>{label}</strong>:
          </span>
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
  }
}

export default PersonalInformationSentEmails;
