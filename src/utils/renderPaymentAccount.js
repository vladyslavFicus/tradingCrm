import { shortify } from './uuid';

export default (account) => {
  const creditCardMatch = account
    ? account.match(/^(mc|visa)-(\d{4})/i)
    : null;
  let formatted = shortify(account, null, 2);

  if (creditCardMatch) {
    const [, provider, lastNumbers] = creditCardMatch;

    formatted = `${provider} *${lastNumbers}`;
  }

  return formatted;
}
