import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import EventEmitter, {
  FILTERS_TOGGLER_COLLAPSED,
  FILTERS_TOGGLER_IN_VIEWPORT,
} from 'utils/EventEmitter';
import { ReactComponent as SwitcherIcon } from '../icons/switcher.svg';
import './FiltersTogglerButton.scss';

class FiltersTogglerButton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: null,
  };

  state = {
    collapsed: false,
  };

  componentDidMount() {
    EventEmitter.on(FILTERS_TOGGLER_IN_VIEWPORT, this.onFiltersToggleInViewport);
  }

  componentWillUnmount() {
    EventEmitter.off(FILTERS_TOGGLER_IN_VIEWPORT, this.onFiltersToggleInViewport);
  }

  /**
   * Listener when filters toggler changed state in viewport
   *
   * @param inViewport
   */
  onFiltersToggleInViewport = (inViewport) => {
    this.setState({ collapsed: !inViewport });
  };

  /**
   * Handle filters toggler button click
   */
  handleCollapse = () => {
    this.setState(
      ({ collapsed }) => ({ collapsed: !collapsed }),
      () => {
        // If not collapsed -> scroll page to top
        if (!this.state.collapsed) {
          window.requestAnimationFrame(() => window.scrollTo(0, 0));
        }
      },
    );

    EventEmitter.emit(FILTERS_TOGGLER_COLLAPSED, !this.state.collapsed);
  };

  render() {
    const { className } = this.props;
    const { collapsed } = this.state;

    return (
      <div
        className={classNames(
          'FiltersTogglerButton',
          className,
          {
            'FiltersTogglerButton--collapsed': collapsed,
          },
        )}
        onClick={this.handleCollapse}
      >
        <SwitcherIcon className="FiltersTogglerButton__icon" />
      </div>
    );
  }
}

export default FiltersTogglerButton;
