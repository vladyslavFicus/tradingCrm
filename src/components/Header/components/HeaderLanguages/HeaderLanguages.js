import React, { PureComponent } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import classNames from 'classnames';
import Flag from 'react-world-flags';
import I18n from 'i18n';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { getCountryCode } from 'utils/countryList';
import './HeaderLanguages.scss';

class HeaderLanguages extends PureComponent {
  static propTypes = {
    storage: PropTypes.storage.isRequired,
  };

  state = {
    isOpen: false,
  };

  handleToggleIsOpenState = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  selectLanguage = (e) => {
    const { value } = e.target;
    const { storage } = this.props;

    this.handleToggleIsOpenState();
    storage.set('locale', value);
  };

  render() {
    const { isOpen } = this.state;

    const languages = Object.keys(I18n.translations).filter(lang => lang !== I18n.locale);

    return (
      <Dropdown
        className={classNames('HeaderLanguages', { 'HeaderLanguages--is-open': isOpen })}
        toggle={this.handleToggleIsOpenState}
        isOpen={isOpen}
      >
        <DropdownToggle className="HeaderLanguages__toggle" tag="div">
          <Flag className="HeaderLanguages__flag" code={getCountryCode(I18n.locale)} />
          {I18n.locale}
          <i className="HeaderLanguages__caret fa fa-angle-down" />
        </DropdownToggle>
        <DropdownMenu className="HeaderLanguages__list">
          {languages.map(lang => (
            <DropdownItem
              key={lang}
              className="HeaderLanguages__item"
              onClick={this.selectLanguage}
              value={lang}
            >
              <Flag className="HeaderLanguages__flag" code={getCountryCode(lang)} />
              {lang}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default withStorage(HeaderLanguages);
