import React, { PureComponent } from 'react';
import { Link as OriginalLink } from 'react-router-dom';

/**
 * Some browsers (like Safari, Firefox) doesn't share local storage/cookie context in Incognito Mode for the same host.
 *
 * If your surfing through the site and want to open link in new tab by CTRL+Click or by <a href="" target="_blank" />
 * Then these browsers will create empty local storage context for new tab even if previous tab was opened and same host
 *
 * This point make a trouble for opening links in new tab by target=_blank because client will logouted on new tab.
 *
 * The component provide mechanism to prevent default click handling and use window.open instead of default one if
 * CTRL or CMD key was pushed with click or link with a target="_blank".
 *
 * This hack still working on 15.09.2020 and in such case all local storage context shared between tabs in PRIVATE MODE.
 */
type Props = {
  to: string,
  children: React.ReactNode,
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void,
  target?: '_blank',
  className?: string,
};

class Link<T extends Props> extends PureComponent<T> {
  handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    const { href, target } = e.target as HTMLAnchorElement;

    e.stopPropagation();

    if (e.ctrlKey || e.metaKey || target === '_blank') {
      window.open(href);

      e.preventDefault();
    }

    if (this.props.onClick) this.props.onClick(e);
  };

  render() {
    return <OriginalLink {...this.props} onClick={this.handleClick} />;
  }
}

export default Link;
