import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import { ReactComponent as EmailSVG } from './icons/email.svg';

class PersonalInformationItem extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    additional: PropTypes.any,
    verified: PropTypes.bool,
    className: PropTypes.string,
    withSendEmail: PropTypes.bool,
    onClickSelectEmail: PropTypes.func,
  };

  static defaultProps = {
    value: null,
    additional: null,
    verified: false,
    className: '',
    withSendEmail: false,
    onClickSelectEmail: () => {},
  };

  render() {
    const {
      label,
      value,
      additional,
      verified,
      className,
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
          {additional}
          <If condition={withSendEmail}>
            <EmailSVG onClick={onClickSelectEmail} />
          </If>
        </div>
      </If>
    );
  }
}

export default PersonalInformationItem;
