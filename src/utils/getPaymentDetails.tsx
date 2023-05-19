import I18n from 'i18n-js';

export default (details: any, type: string) => {
  const { amount, currency, cryptoDetails } = details;

  let result = `${I18n.toCurrency(amount, { unit: '' })} ${currency}`;

  if (type === 'WITHDRAWAL' && cryptoDetails) {
    result += ` (${cryptoDetails.network}, ${cryptoDetails.network} - ${cryptoDetails.tokenContractAddress})`;
  }

  return result;
};
