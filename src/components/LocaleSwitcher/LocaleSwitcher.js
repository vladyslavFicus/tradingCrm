import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import PropTypes from '../../constants/propTypes';

class LocaleSwitcher extends Component {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.dropDownOption).isRequired,
    currentLocale: PropTypes.string.isRequired,
    changeLocale: PropTypes.func.isRequired,
  };

  handleChoose = value => this.props.changeLocale(value);

  render() {
    const { languages, currentLocale } = this.props;

    return (
      <ButtonGroup>
        {languages.map(language => (
          <Button
            key={language.value}
            color=""
            onClick={() => this.handleChoose(language.value)}
            active={currentLocale === language.value}
          >{language.label}</Button>
        ))}
      </ButtonGroup>
    );
  }
}

export default LocaleSwitcher;
