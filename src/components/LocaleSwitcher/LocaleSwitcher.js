import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import PropTypes from '../../constants/propTypes';

class LocaleSwitcher extends Component {
  static propTypes = {
    languages: PropTypes.dropDownOption.isRequired,
    currentLocale: PropTypes.string.isRequired,
    changeLocale: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.currentLocale,
    };
  }

  handleChoose = value => this.setState({ value }, this.props.changeLocale(value));

  render() {
    const { value } = this.state;
    const { languages } = this.props;

    return (
      <div>
        <ButtonGroup>
          {languages.map(language => (
            <Button
              color=""
              onClick={() => this.handleChoose(language.value)}
              active={value === language.value}
            >{language.label}</Button>
          ))}
        </ButtonGroup>
      </div>
    );
  }
}

export default LocaleSwitcher;
