import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import 'react-select/dist/react-select.css';
import './ButtonSelect.scss';

class ButtonSelect extends Component {
  focus = () => {
    this.props.onClick();
  };

  bindSelectRef = (selectField) => {
    this.selectField = selectField;
  };

  render() {
    const { opened, onCloseClick, label, className, placeholder, ...rest } = this.props;

    return (
      <div className="btn-group tag-group button-select">
        <span className="tag-arrow tag-arrow-default" />

        <div className={classNames('auto-complete', 'ignore-react-onclickoutside', { opened })} id="add-tag-field">
          <ReactSelect
            {...rest}
            placeholder={placeholder}
            ref={this.bindSelectRef}
          />
        </div>

        <button className={className} onClick={this.focus}>
          {label}
        </button>

        <button
          type="button"
          className="btn btn-xs btn-delete"
          onClick={onCloseClick}
        >
          &times;
        </button>
      </div>
    );
  }
}

ButtonSelect.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  opened: PropTypes.bool,
  onCloseClick: PropTypes.func.isRequired,
};
ButtonSelect.defaultProps = {
  className: '',
  placeholder: '',
  opened: false,
};

export default onClickOutside(ButtonSelect);
