import React from 'react';
import { Link as OriginalLink } from 'react-router-dom';
import useLink from '../hooks/useLink';

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

const Link = (props: Props) => {
  const { onClick = () => {} } = props;

  const {
    handleClick,
  } = useLink(onClick);

  return <OriginalLink {...props} onClick={handleClick} />;
};

export default React.memo(Link);
