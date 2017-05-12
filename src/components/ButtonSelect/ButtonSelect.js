import React, { Component, PropTypes } from 'react';
import ReactSelect from 'react-select';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import 'react-select/dist/react-select.css';
import './ButtonSelect.scss';

class ButtonSelect extends Component {
  focus = () => {
    this.props.onClick();
  };

  render() {
    const { opened, onCloseClick, label, className, ...rest } = this.props;

    return <div className={classNames('button-select')}>
      <span className="tag-arrow tag-arrow-default" />

      <div className={classNames('auto-complete', 'ignore-react-onclickoutside', { opened })}>
        <ReactSelect {...rest} placeholder="" ref={(selectField) => { this.selectField = selectField; }} />
      </div>

      <button className={className} onClick={this.focus}>
        {label}
      </button>

      <button
        type="button"
        className={`btn btn-xs btn-secondary btn-delete`}
        onClick={onCloseClick}
      >&times;</button>
    </div>;
  }
}

ButtonSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  className: PropTypes.any,
  label: PropTypes.any,
};

export default onClickOutside(ButtonSelect);
