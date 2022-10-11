import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { InView } from 'react-intersection-observer';
import { Button } from 'components/UI';
import EventEmitter, {
  FILTERS_TOGGLER_COLLAPSED,
  FILTERS_TOGGLER_IN_VIEWPORT,
} from 'utils/EventEmitter';
import { ReactComponent as SwitcherIcon } from './icons/switcher.svg';
import './FiltersToggler.scss';

class FiltersToggler extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    hideButton: PropTypes.bool,
    viewPortMarginTop: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    hideButton: false,
    viewPortMarginTop: 0,
  }

  state = {
    collapsed: false,
  };

  componentDidMount() {
    EventEmitter.on(FILTERS_TOGGLER_COLLAPSED, this.onFiltersTogglerCollapsed);
  }

  componentWillUnmount() {
    EventEmitter.off(FILTERS_TOGGLER_COLLAPSED, this.onFiltersTogglerCollapsed);
  }

  /**
   * Listener when collapse event was fired
   *
   * @param collapsed
   */
  onFiltersTogglerCollapsed = (collapsed) => {
    this.setState({ collapsed });
  };

  /**
   * Listener when filters toggler content changed state in viewport
   *
   * @param inViewport
   */
  onChangeViewport = (inViewport) => {
    EventEmitter.emit(FILTERS_TOGGLER_IN_VIEWPORT, inViewport);
  };

  handleCollapse = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  render() {
    const {
      children,
      className,
      hideButton,
      viewPortMarginTop,
    } = this.props;
    const { collapsed } = this.state;

    return (
      <div
        className={
          classNames('FiltersToggler', {
            'FiltersToggler--collapsed': collapsed,
            className,
          })
        }
      >
        <If condition={!hideButton}>
          <div className="FiltersToggler__actions">
            <Button
              tertiary
              className="FiltersToggler__button"
              onClick={this.handleCollapse}
            >
              <SwitcherIcon className="FiltersToggler__icon" />
            </Button>
          </div>
        </If>

        <If condition={children && !collapsed}>
          <InView
            onChange={this.onChangeViewport}
            rootMargin={`-${viewPortMarginTop}px 0px 0px 0px`}
          >
            {children}
          </InView>
        </If>
      </div>
    );
  }
}

export default FiltersToggler;
