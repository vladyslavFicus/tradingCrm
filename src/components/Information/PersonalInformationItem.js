import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import { ReactComponent as PhoneSVG } from './icons/phone.svg';
import { ReactComponent as EmailSVG } from './icons/email.svg';

class PersonalInformationItem extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    verified: PropTypes.bool,
    className: PropTypes.string,
    withCall: PropTypes.bool,
    onClickToCall: PropTypes.func,
    withSendEmail: PropTypes.bool,
    onClickSelectEmail: PropTypes.func,
  };

  static defaultProps = {
    value: null,
    verified: false,
    className: '',
    withCall: false,
    onClickToCall: () => {},
    withSendEmail: false,
    onClickSelectEmail: () => {},
  };

  render() {
    const {
      label,
      value,
      withCall,
      verified,
      className,
      onClickToCall,
      withSendEmail,
      onClickSelectEmail,
    } = this.props;

    return (
      <If condition={value}>
        <div className={className}>
          <strong>{label}</strong>: {value}
          {' '}
          <If condition={verified}>
            <i className="fa fa-check text-success" />
          </If>
          <If condition={withCall}>
            <PhoneSVG onClick={onClickToCall} />
          </If>
          <If condition={withSendEmail}>
            <EmailSVG onClick={onClickSelectEmail} />
          </If>
        </div>
      </If>
    );
  }
}

export default PersonalInformationItem;
