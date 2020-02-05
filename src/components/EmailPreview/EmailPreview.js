import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectName } from 'utils/injectName';
import './EmailPreview.scss';

class EmailPreview extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    templatePreview: PropTypes.bool,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  };

  static defaultProps = {
    templatePreview: false,
    firstName: '',
    lastName: '',
  };

  render() {
    const {
      templatePreview,
      firstName,
      lastName,
      label,
      text,
    } = this.props;

    return (
      <Fragment>
        <label className="EmailPreview__label">{label}</label>
        <div
          className="EmailPreview__body"
          dangerouslySetInnerHTML={{
            __html: templatePreview ? injectName(firstName, lastName, text) : text,
          }}
        />
      </Fragment>
    );
  }
}

export default EmailPreview;
