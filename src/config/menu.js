const sidebar = [
  {
    label: 'Users', icon: 'fa fa-users',
    items: [
      { label: 'All', url: '/users/list' },
      { label: 'Dormant', url: '/users/dormant' },
    ],
  },
  { label: 'InReview profiles', url: '/profiles-review', icon: 'fa fa-user-times' },
  { label: 'Transactions', url: '/transactions', icon: 'fa fa-credit-card' },
  { label: 'Bonus campaigns', url: '/bonus-campaigns', icon: 'fa fa-gift' },
  { label: 'Bonuses', url: '/bonuses', icon: 'fa fa-gift' },
  { label: 'Terms & conditions', url: '/terms', icon: 'fa fa-align-justify' },
  {
    label: 'Reports', icon: 'fa fa-align-justify',
    items: [
      { label: 'Player liability', url: '/reports/player-liability' },
      { label: 'Revenue', url: '/reports/revenue' },
    ],
  },
];

export {
  sidebar,
};
