import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, PopoverBody, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import keyMirror from 'keymirror';
import { I18n } from 'react-redux-i18n';
import { Scrollbars } from 'react-custom-scrollbars';
import fakeI18n from '../../../../../../utils/fake-i18n';
import Amount from '../../../../../../components/Amount';
import './AvailabilityPopover.scss';

const tabs = keyMirror({
  DEPOSIT: null,
  WITHDRAW: null,
  FULLY_DISABLED: null,
});

const tabsLabels = {
  [tabs.DEPOSIT]: fakeI18n.t('PAYMENT.METHODS.AVAILABILITY.TAB.DEPOSIT'),
  [tabs.WITHDRAW]: fakeI18n.t('PAYMENT.METHODS.AVAILABILITY.TAB.WITHDRAW'),
  [tabs.FULLY_DISABLED]: fakeI18n.t('PAYMENT.METHODS.AVAILABILITY.TAB.FULLY_DISABLED'),
};

class AvailabilityPopover extends Component {
  static propTypes = {
    placement: PropTypes.string,
    target: PropTypes.string.isRequired,
    toggle: PropTypes.func,
    countries: PropTypes.object,
  };

  static defaultProps = {
    placement: 'left-start',
    toggle: null,
    countries: {},
  };

  state = {
    activeTab: null,
    search: '',
  };

  componentDidMount() {
    this.toggleTab(tabs.DEPOSIT);
  }

  getTabCountries = () => {
    const { countries } = this.props;
    const { search, activeTab } = this.state;

    let result;
    switch (activeTab) {
      case tabs.DEPOSIT:
        result = Object.keys(countries).filter(key => !countries[key].depositLimit.disabled);
        break;
      case tabs.WITHDRAW:
        result = Object.keys(countries).filter(key => !countries[key].withdrawLimit.disabled);
        break;
      case tabs.FULLY_DISABLED:
        result = Object.keys(countries)
          .filter(key => countries[key].depositLimit.disabled && countries[key].withdrawLimit.disabled);
        break;
      default:
        result = [];
    }

    return result.filter(country => country.startsWith(search)).reduce((_result, item) => {
      const countryFirstLetter = item.charAt(0);

      if (_result[countryFirstLetter]) {
        _result[countryFirstLetter].push(item);
      } else {
        return { ..._result, [countryFirstLetter]: [item] };
      }

      return _result;
    }, {});
  };

  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  handleSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  renderLimit = (country) => {
    const { activeTab } = this.state;
    const { countries } = this.props;

    const limitType = activeTab === tabs.DEPOSIT ? 'depositLimit' : 'withdrawLimit';
    const { disabled, available, min, max, currencyCode } = countries[country][limitType];

    if (!available) {
      return <span className="color-warning">{I18n.t('PAYMENT.METHODS.LIMITS.NOT_AVAILABLE')}</span>;
    }

    if (disabled) {
      return <span className="color-danger">{I18n.t('PAYMENT.METHODS.LIMITS.DISABLED')}</span>;
    }

    if (!min && !max) {
      return <span>{I18n.t('PAYMENT.METHODS.LIMITS.NOT_LIMITED')}</span>;
    }

    if (min && max) {
      return (
        <span>
          <Amount amount={min} currency={currencyCode} />
          {' - '}
          <Amount amount={max} currency={currencyCode} />
        </span>
      );
    }

    if (min) {
      return <span>min. <Amount amount={min} currency={currencyCode} /></span>;
    }

    if (max) {
      return <span>max. <Amount amount={max} currency={currencyCode} /></span>;
    }

    return I18n.t('PAYMENT.METHODS.LIMITS.UNDEFINED');
  };

  renderTabListElements = () => {
    const { search, activeTab } = this.state;
    const tabCountries = this.getTabCountries();

    const tabListElements = [];
    Object.keys(tabCountries).forEach((letter, key) => {
      tabListElements.push(
        <div className="font-weight-700" key={[`${key}-${letter}`]}>
          {letter}
        </div>,
      );

      tabCountries[letter].forEach((country) => {
        tabListElements.push(
          <div key={[`${key}-${country}`]}>
            <span className="font-weight-700 margin-right-5">{country}</span>
            <span className="availability-popover__tab-value">{this.renderLimit(country)}</span>
          </div>,
        );
      });
    });

    if (!tabListElements.length && search) {
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: I18n.t('PAYMENT.METHODS.AVAILABILITY.NO_RESULT_BY_SEARCH', {
              search: `<span class="font-weight-700">${search}</span>`,
              tabName: `<span class="availability-popover__tab-name">${I18n.t(tabsLabels[activeTab])}</span>`,
            }),
          }}
        />
      );
    }

    return tabListElements;
  };

  render() {
    const { placement, target, toggle } = this.props;
    const { activeTab, search } = this.state;

    return (
      <Popover
        placement={placement}
        isOpen
        toggle={toggle}
        target={target}
        className="availability-popover"
        container={target}
      >
        <PopoverBody>
          <Nav className="availability-popover__nav">
            {Object.keys(tabs).map(tab => (
              <NavItem className="availability-popover__nav-item" key={tab}>
                <NavLink
                  className={classNames('availability-popover__nav-tab', { active: activeTab === tab })}
                  onClick={() => { this.toggleTab(tab); }}
                >
                  {I18n.t(tabsLabels[tab])}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent activeTab={activeTab}>
            <div className="availability-popover-search">
              <i className="icon icon-search" />
              <input
                onChange={this.handleSearch}
                className="form-control"
                value={search}
                type="text"
                placeholder={I18n.t('PAYMENT.METHODS.AVAILABILITY.SEARCH_PLACEHOLDER')}
              />
            </div>
            <TabPane className="availability-popover__tab" tabId={activeTab}>
              <Scrollbars
                autoHeight
                autoHeightMax={150}
                hideTracksWhenNotNeeded
                thumbSize={30}
                renderTrackHorizontal={props => <div {...props} style={{ display: 'none' }} />}
                renderThumbHorizontal={props => <div {...props} style={{ display: 'none' }} />}
                renderThumbVertical={props => <div {...props} style={{ backgroundColor: '#cbcbcb' }} />}
              >
                {this.renderTabListElements()}
              </Scrollbars>
            </TabPane>
          </TabContent>
        </PopoverBody>
      </Popover>
    );
  }
}

export default AvailabilityPopover;
