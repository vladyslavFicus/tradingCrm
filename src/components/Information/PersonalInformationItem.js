import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';
import { ReactComponent as EmailSVG } from './icons/email.svg';
import './PersonalInformationItem.scss';

class PersonalInformationItem extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    additional: PropTypes.any,
    verified: PropTypes.bool,
    className: PropTypes.string,
    withSendEmail: PropTypes.bool,
    onClickSelectEmail: PropTypes.func,
    onClickValue: PropTypes.func,
  };

  static defaultProps = {
    value: null,
    additional: null,
    verified: false,
    className: '',
    withSendEmail: false,
    onClickSelectEmail: () => {},
    onClickValue: () => {},
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
      onClickValue,
    } = this.props;

    return (
      <If condition={value}>
        <div className={classNames('PersonalInformationItem', className)}>
          <div className="PersonalInformationItem__content">
            <strong>{label}</strong>: <span onClick={onClickValue}>{value}</span>
            {' '}
            <If condition={verified}>
              <i className="fa fa-check text-success" />
            </If>
          </div>
          <div className="PersonalInformationItem__additional">
            {additional}
            <If condition={withSendEmail}>
              <EmailSVG onClick={onClickSelectEmail} />
            </If>
          </div>
        </div>
      </If>
    );
  }
}

export default PersonalInformationItem;
