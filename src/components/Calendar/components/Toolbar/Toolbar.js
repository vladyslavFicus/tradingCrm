import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-big-calendar';
import classNames from 'classnames';
import './Toolbar.scss';

class Toolbar extends PureComponent {
  static propTypes = {
    label: PropTypes.node.isRequired,
    view: PropTypes.string.isRequired,
    views: PropTypes.arrayOf(PropTypes.string).isRequired,
    localizer: PropTypes.object.isRequired,
    onNavigate: PropTypes.func.isRequired,
    onView: PropTypes.func.isRequired,
  };

  navigateNext = () => this.props.onNavigate(Navigate.NEXT);
  navigatePrev = () => this.props.onNavigate(Navigate.PREVIOUS);

  viewNamesGroup(messages) {
    const { views, view } = this.props;

    if (views.length > 1) {
      return views.map(name => (
        <button
          key={name}
          className={classNames('btn', { 'btn-primary': view === name })}
          onClick={() => this.props.onView(name)}
        >
          {messages[name]}
        </button>
      ));
    }

    return null;
  }

  render() {
    const { label, localizer: { messages } } = this.props;

    return (
      <div className="Toolbar d-flex align-items-center justify-content-between">
        <div className="col-3" />
        <div className="d-flex justify-content-center align-items-center col-6">
          <button className="Toolbar__arrow" onClick={this.navigatePrev}>
            <i className="fa fa-angle-left" />
          </button>

          <span className="Toolbar__label">{label}</span>

          <button className="Toolbar__arrow" onClick={this.navigateNext}>
            <i className="fa fa-angle-right" />
          </button>
        </div>

        <div className="col-3 d-flex justify-content-end">{this.viewNamesGroup(messages)}</div>
      </div>
    );
  }
}

export default Toolbar;
