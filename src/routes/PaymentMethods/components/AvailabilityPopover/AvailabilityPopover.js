import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Popover, PopoverContent, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Input,
} from 'reactstrap';
import classNames from 'classnames';
import keyMirror from 'keymirror';
import { I18n } from 'react-redux-i18n';
import fakeI18n from '../../../../utils/fake-i18n';
import Amount from '../../../../components/Amount';
import AvailabilityPopoverStyle from './AvailabilityPopover.scss';

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
    placement: 'left',
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
        result = Object.keys(countries).filter(key =>
          !countries[key].depositLimit.disabled
        );
        break;
      case tabs.WITHDRAW:
        result = Object.keys(countries).filter(key =>
          !countries[key].withdrawLimit.disabled
        );
        break;
      case tabs.FULLY_DISABLED:
        result = Object.keys(countries).filter(key =>
          countries[key].depositLimit.disabled && countries[key].withdrawLimit.disabled
        );
        break;
      default:
        result = [];
    }

    return result.filter(country => country.startsWith(search)).reduce((result, item) => {
      const countryFirstLetter = item.charAt(0);

      if (result[countryFirstLetter]) {
        result[countryFirstLetter].push(item);
      } else {
        result = { ...result, [countryFirstLetter]: [item] };
      }
      return result;
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
    Object.keys(tabCountries).map((letter, key) => {
      tabListElements.push(
        <Col className="col-xs-12" key={`${key}-${letter}`}>
          <span className="font-weight-700">{letter}</span>
        </Col>
      );

      tabCountries[letter].map((country) => {
        tabListElements.push(
          <Col className="col-xs-12" key={`${key}-${country}`}>
            <span className="font-weight-700">{country}</span> {'- '}
            <span className="color-default">{this.renderLimit(country)}</span>
          </Col>
        );
      });
    });

    if (!tabListElements.length && search) {
      return (
        <Col
          className="col-xs-12"
          dangerouslySetInnerHTML={{
            __html: I18n.t('PAYMENT.METHODS.AVAILABILITY.NO_RESULT_BY_SEARCH', {
              search: `<span class="font-weight-700">${search}</span>`,
              tabName: `<span class="tab-name">${I18n.t(tabsLabels[activeTab])}</span>`,
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
        cssModule={AvailabilityPopoverStyle}
        placement={placement}
        isOpen
        toggle={toggle}
        target={target}
      >
        <div className="availability-popover-container">
          <PopoverContent>
            <Nav tabs>
              {
                Object.keys(tabs).map(tab => (
                  <NavItem key={tab}>
                    <NavLink
                      className={classNames({ active: activeTab === tab })}
                      onClick={() => { this.toggleTab(tab); }}
                    >
                      {I18n.t(tabsLabels[tab])}
                    </NavLink>
                  </NavItem>
                ))
              }
            </Nav>
            <TabContent activeTab={activeTab}>
              <div className="form-input-icon">
                <i className="icmn-search" />
                <Input
                  onChange={this.handleSearch}
                  className="form-control input-sm"
                  value={search}
                  type="text"
                  placeholder={I18n.t('PAYMENT.METHODS.AVAILABILITY.SEARCH_PLACEHOLDER')}
                />
              </div>
              <hr />
              <TabPane tabId={activeTab}>
                <Row>
                  {this.renderTabListElements()}
                </Row>
              </TabPane>
            </TabContent>
          </PopoverContent>
        </div>
      </Popover>
    );
  }
}

export default AvailabilityPopover;
