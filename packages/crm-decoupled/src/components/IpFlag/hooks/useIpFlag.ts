import countryList from 'country-list';

type Props = {
  country: string,
  ip?: string,
}

const useIpFlag = (props: Props) => {
  const { ip, country } = props;

  const countryName = country ? countryList().getName(country) : null;
  const tooltipContent = [countryName, ip].join(' - ');

  return {
    tooltipContent,
  };
};

export default useIpFlag;
