import React, { Component, PropTypes } from 'react';
import {
  Popover, PopoverContent, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Input,
} from 'reactstrap';
import classNames from 'classnames';
import keyMirror from 'keymirror';
import Amount from '../../../../components/Amount';
import AvailabilityPopoverStyle from './AvailabilityPopover.scss';

const tabs = keyMirror({
  DEPOSIT: null,
  WITHDRAW: null,
  FULLY_DISABLED: null,
});

const tabsLabels = {
  [tabs.DEPOSIT]: 'Deposit',
  [tabs.WITHDRAW]: 'Withdraw',
  [tabs.FULLY_DISABLED]: 'Fully disabled',
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

    const groupByFirstLetter = result.filter(country => country.startsWith(search)).reduce((result, item) => {
      const countryFirstLetter = item.charAt(0);

      if (result[countryFirstLetter]) {
        result[countryFirstLetter].push(item);
      } else {
        result = { ...result, [countryFirstLetter]: [item] };
      }
      return result;
    }, []);

    return groupByFirstLetter;
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
    const { disabled, min, max, currencyCode } = countries[country][limitType];

    if (disabled) {
      return <span className="color-danger">Disabled</span>;
    }

    if (!min && !max) {
      return <span>Not limited</span>;
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
      return <span> min. <Amount amount={min} currency={currencyCode} /> </span>;
    }

    if (max) {
      return <span> max. <Amount amount={max} currency={currencyCode} /> </span>;
    }

    return 'unavailable';
  };

  renderTabListElements = () => {
    const { search, activeTab } = this.state;
    const tabCountries = this.getTabCountries();

    const tabListElements = [];
    Object.keys(tabCountries).map((letter, key) => {
      const letterElement = (
        <Col key={`${key}-${letter}`}>
          <span className="font-weight-700">{letter}</span>
        </Col>
      );
      tabListElements.push(letterElement);

      tabCountries[letter].map(country => {
        const countryElement = (
          <Col key={`${key}-${country}`}>
            <span className="font-weight-700">{country}</span> {'- '}
            <span className="color-default">{this.renderLimit(country)}</span>
          </Col>
        );
        tabListElements.push(countryElement);
      });
    });

    if (!tabListElements.length && search) {
      return (
        <Col>
          {'No countries begins from '}
          <span className="font-weight-700">{search}</span> {'found in '}
          <span className="tab-name">{tabsLabels[activeTab]}</span>
        </Col>
      );
    }

    return (
      tabListElements.map(element => element)
    );
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
        <PopoverContent>
          <div className="availability-popover">
            <Nav tabs>
              {
                Object.keys(tabs).map(tab => (
                  <NavItem key={tab}>
                    <NavLink
                      className={classNames({ active: activeTab === tab })}
                      onClick={() => { this.toggleTab(tab); }}
                    >
                      {tabsLabels[tab]}
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
                  name="search"
                  placeholder="Quick search by country"
                />
              </div>
              <hr />
              <TabPane tabId={activeTab}>
                <Row>
                  { this.renderTabListElements() }
                </Row>
              </TabPane>
            </TabContent>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
}

export default AvailabilityPopover;
