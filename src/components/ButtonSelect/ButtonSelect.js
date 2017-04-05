import React, { Component, PropTypes } from 'react';
import ReactSelect from 'react-select';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import 'react-select/dist/react-select.css';
import './ButtonSelect.scss';

class ButtonSelect extends Component {
  render() {
    const { opened, onClick, label, className, ...rest } = this.props;

    return <div className={classNames('button-select margin-left-10')}>
      <span className="tag-arrow tag-arrow-default" />
      <button className={className} onClick={onClick}>
        {label}
      </button>

      <div className={classNames('auto-complete', 'ignore-react-onclickoutside margin-left-10', { opened })}>
        <ReactSelect {...rest} />
      </div>
    </div>;
  }
}

ButtonSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  className: PropTypes.any,
  label: PropTypes.any,
};

export default onClickOutside(ButtonSelect);
