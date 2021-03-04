import React, { PureComponent } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import PropTypes from '../../constants/propTypes';

class LocaleSwitcher extends PureComponent {
  static propTypes = {
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
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
            key={language}
            color=""
            onClick={() => this.handleChoose(language)}
            active={currentLocale === language}
          >{language}
          </Button>
        ))}
      </ButtonGroup>
    );
  }
}

export default LocaleSwitcher;
