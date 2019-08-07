import moment from 'moment';

export default function () {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  return {
    startDate: moment(firstDay).format('YYYY-MM-DDTHH:mm:ss'),
    endDate: moment(lastDay).format('YYYY-MM-DDTHH:mm:ss'),
  };
}
