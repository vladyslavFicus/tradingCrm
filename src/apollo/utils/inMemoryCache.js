import { InMemoryCache } from '@apollo/client';
import pagination from './pagination';

export default new InMemoryCache({
  typePolicies: {
    // Policies for pagination
    Query: {
      fields: {
        profiles: pagination('args.page.from'),
        feeds: pagination('page'),
        files: pagination('page'),
        tradingAccounts: pagination('page.from'),
        leads: pagination('args.page.from'),
        operators: pagination('page.from'),
        partners: pagination('page.from'),
        payments: pagination('args.page.from'),
        clientPayments: pagination('args.page.from'),
        clientCallbacks: pagination('page.from'),
        leadCallbacks: pagination('page.from'),
        tradingActivity: pagination('page'),
        notes: pagination('page'),
        notificationCenter: pagination('args.page.from'),
        distributionRules: pagination('args.page'),
        tradingEngineAccounts: pagination('args.page.from'),
        tradingEngineOrders: pagination('args.page.from'),
        tradingEngineTransactions: pagination('args.page.from'),
        tradingEngineHistory: pagination('args.page.from'),
        tradingEngineAdminSymbols: pagination('args.page.from'),
        tradingEngineAdminGroups: pagination('args.page.from'),
        ipWhitelistSearch: pagination('args.page.from'),
        documentSearch: pagination('args.page.from'),
        callHistory: pagination('args.page.from'),
      },
    },
    TradingEngineQuery: {
      merge: true,
      fields: {
        symbols: pagination('args.page.from'),
        groups: pagination('args.page.from'),
        orders: pagination('args.page.from'),
        accounts: pagination('args.page.from'),
        transactions: pagination('args.page.from'),
        history: pagination('args.page.from'),
        operators: pagination('args.page.from'),
        holidays: pagination('args.page.from'),
      },
    },

    // Other policies
    Profile: {
      merge: true,
    },
    Profile__Affiliate: {
      merge: true,
    },
    Profile__Configuration: {
      merge: true,
    },
    Profile__KYC: {
      merge: true,
    },
    Profile__Contacts: {
      merge: true,
    },
    Profile__Phone__Contacts: {
      merge: true,
    },
    ProfileView: {
      merge: true,
    },
    Pageable__Operator: {
      merge: true,
    },
    Pageable__Payment: {
      merge: true,
    },
    Payment__ClientProfile: {
      merge: true,
    },
    Pageable__Note: {
      merge: true,
    },
    TradingEngineAccountSymbolConfig: {
      merge: true,
    },
    TradingEngineAccount: {
      merge: true,
    },
    TradingEngineOrder__Time: {
      merge: true,
    },
    TradingEngineSecurity: {
      merge: true,
    },
    HierarchyBranch: {
      merge: true,
    },
    Partner: {
      merge: true,
    },
    SettingsQuery: {
      merge: true,
      fields: {
        paymentSystemsProvider: pagination('args.page.from'),
      },
    },
    Lead__Contacts: {
      merge: true,
    },
  },
});
