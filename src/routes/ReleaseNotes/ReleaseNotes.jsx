import React, { Fragment } from 'react';

const ReleaseNotes = () => (
  <Fragment>
    <h1>Release notes 19/Feb/19 - Version 12</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Clients - Bulk Assignment of clients to multiple Operators</li>
      <li>Payments - Canceled transactions have corresponding status</li>
      <li>Payments - Bonus payment method added</li>
      <li>Password generator improved</li>
    </ul>

    <h1>Release notes 12/Feb/19 - Version 11</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Leads - Filter leads by account status</li>
      <li>Payments - Set reason on Withdrawal rejection</li>
      <li>Universal Sales and Retention rules improvement</li>
      <li>Clients search - Filter clients by assigned operators</li>
      <li>Clients search - Limit filter allow to limit an amount of found clients</li>
      <li>
        On client creation rules will be ignored if lead with the same email has assigned sales agent,
        so that client will get the same sales agent assigned
      </li>
      <li>
        Affiliate API - Allows to register clients via API, get clients of the affiliate
        and get client&apos;s details by email or UUID
      </li>
      <li>Affiliate API - Autologin link will be sent in response to successful client signup via API</li>
      <li>Leads - Limit filter allow to limit an amount of found leads</li>
      <li>Leads - Converted by operator on leads is been showed in the grid</li>
      <li>Operator config service is created to manage restricted countries and white listed IPs for affiliates</li>
      <li>Hierarchy - Operators assigned Brands / Desks / Teams can be reviewed and changed in operators profile</li>
      <li>Clean up mt4 service from accounts created by automation tests</li>
      <li>
        Temporary solution on Multi-Currency - client can choose currency on sign up,
        but can have MT4 trading accounts in profiles currency only
      </li>
      <li>Leads - Search for Leads by Source and Affiliate</li>
      <li>Lead UUID will be displayed in clients profile after conversion</li>
      <li>Operator who created Office, Desk or Team will not be assigned to it any more</li>
      <li>Leads profile can be opened in a new browser tab</li>
      <li>Affiliate will be displayed in clients grid and client profile</li>
      <li>Client Portal - Right to left languages support added</li>
      <li>Client Portal - Russian, Chinese, Italian, Arabic, German and Spanish languages has been added</li>
      <li>
        &quot;Backoffice has been updated&quot; and &quot;Client portal has been updated&quot; popups
        has been added to prevent users of using old version of application
      </li>
      <li>Payments - Payment method filter got multiselect option</li>
    </ul>

    <h2>Bugs & Fixes</h2>
    <ul>
      <li>Multibranding fixes and improvements</li>
      <li>General performance improvements (GQL)</li>
      <li>Elastic Search improvements</li>
      <li>Filtering by Desk and Teams is fixes</li>
      <li>Clients search - Search by first and last name fixed</li>
      <li>Leads - Saving personal details fixed</li>
      <li>Clients search - Clients can be filtered by balance amount range</li>
      <li>UX - General filter reset fix</li>
      <li>Leads - Sales status filter fixed</li>
      <li>Permissions - Retention and Sales agents can&apos;t see the Hierarchy section in Backoffice</li>
      <li>Client portal - Deposit flow has been improved</li>
      <li>Rules - Universal Sales and Retention rules are fixed</li>
    </ul>

    <h1>Release notes 05/Feb/19 - Version 10</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Leads - Filter leads by assigned operators</li>
      <li>Payments - Electronic payment and None payment methods are added for manual transactions</li>
      <li>Leads query optimization - 10x performance grow</li>
    </ul>

    <h2>Bugs & Fixes</h2>
    <ul>
      <li>Hierarchy - Operators are been showed based on Hierarchy</li>
    </ul>

    <h1>Release notes 29/Jan/19 - Version 9</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        Emails will convert to lowercase on search and email change. Old emails on production are migrated to lowercase
      </li>
      <li>Retention manager is able to change retention status in clients grid and profile</li>
    </ul>

    <h2>Bugs & Fixes</h2>
    <ul>
      <li>Leads - Sales status filter fixed</li>
    </ul>

    <h1>Release notes 22/Jan/19 - Version 8</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Clients search - Desks and teams are displayed on client grid</li>
      <li>Leads - Assign sales agents and change sales status from leads profile</li>
      <li>Leads - Assign of selected leads to many operators</li>
      <li>Leads - Desk, team and assignee name are displayed in leads grid</li>
      <li>White list of IPs limits access to Backoffice</li>
      <li>Notes - Notes on lead&apos;s profile</li>
      <li>Clients search - Teams and desks are displayed in clients grid</li>
      <li>Leads - individual assign to sales agent from leads profile</li>
      <li>Leads - Assign selected leads to several sales agents</li>
    </ul>

    <h2>Bugs & Fixes</h2>
    <ul>
      <li>Lead search by phone fixed</li>
      <li>Lead to client promotion improved</li>
      <li>Filtering clients by Desk and Team is fixed</li>
      <li>Lead personal details are transferring to clients details</li>
      <li>Client Portal Signup form fixed</li>
      <li>Payments - Integer are now allowed to enter in manual transaction amount field</li>
      <li>Error messages are improved on leads CSV file uploads</li>
    </ul>

    <h1>Release notes 15/Jan/19 - Version 7</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Leads - Lead&apos;s sales representative name is displayed in leads grid and profile</li>
      <li>Payments - Error message is displayed on failed payment transactions</li>
      <li>Payments - Reconciliation service created</li>
      <li>Leads - Assign of selected leads to many agents with round robin distribution</li>
      <li>Hierarchy - Ability to add an Operator to the Desk or Team</li>
      <li>Notes - Payment transactions internal note can be added, changed and deleted</li>
      <li>Payments - Filter payment transactions by Original agent</li>
      <li>Clients search - Search clients by phone or alternative phone</li>
      <li>Hierarchy - Performance improvement</li>
      <li>Dashboard - Only completed deposits/withdrawals are displayed on dashboard</li>
      <li>Documents - Preview of uploaded files</li>
      <li>Leads - Bulk assign to sales agent</li>
      <li>Leads - Set status Converted on leads profile on signed up client with the same email</li>
      <li>Payments - Filter payment transactions by list of Original Agents</li>
      <li>Hierarchy - Ability to add an operator to Brand/Office/Desk/Team on it&apos;s creation</li>
      <li>Notes - Ability to add a note on callbacks</li>
    </ul>

    <h2>Bugs & Fixes</h2>
    <ul>
      <li>Rules - Adding of retention rules has been fixed</li>
      <li>Payments - Original agent is now showing on manual transactions</li>
      <li>Language on client profile can now be updated</li>
      <li>Credit balance is displayed on trading account</li>
      <li>Payments - Amount range filter is fixed</li>
      <li>Client search - Reset filters button fixed</li>
      <li>Logged out operator are being redirected to login page</li>
      <li>Leads - Promotion of lead to client is fixed</li>
    </ul>

    <h1>Release notes 08/Jan/19 - Version 6</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Leads - CSV upload improvement</li>
    </ul>

    <h2>Bugs & Fixes</h2>
    <ul>
      <li>Payments - Deposit has been fixed</li>
    </ul>

    <h1>Release notes 01/Jan/19 - Version 5</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Payments - Original Agent of transaction is beeng stored and displayed in transaction details</li>
      <li>Callbacks - Personal calendar is available at the header of Backoffice</li>
      <li>Universal sales and retention rules for all countries and languages</li>
      <li>Total credit amount is shown at clients profile header</li>
    </ul>

    <h2>Bugs & Fixes</h2>
    <ul>
      <li>Trades volume(Size) is displayed correctly</li>
      <li>Client portal - Sign-up is fixed</li>
      <li>Leads - CSV upload without phonecodes</li>
      <li>Usability - Filter was improved to be easy cleared</li>
      <li>Callbacks date range filter fixed</li>
      <li>Payments - Manual transactions can now be filtered</li>
    </ul>

    <h1>Release notes 25/Dec/18 - Version 4</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Payments - External Reference ID are displayed in transactions details</li>
      <li>Payments - Last 10 Deposits and Withdrawals on dashboard are displayed based on Hierarchy</li>
      <li>Leads - By default 20 last added Leads are displayed in leads grid</li>
      <li>Hierarchy visualization feature allows to see the hierarchy structure</li>
      <li>Approve and Reject of Withdrawal requests has been improved</li>
      <li>MT4 - Trading account password can be changed in clients profile</li>
    </ul>

    <h2>Bugs & Fixes</h2>
    <ul>
      <li>Payments search has been fixed</li>
      <li>Leads search has been fixed</li>
      <li>Credit out validation has been fixed</li>
    </ul>

    <h1>Release notes 18/Dec/18 - Version 3</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Dashboard charts sections has been redesigned</li>
      <li>Withdrawal requests can now be approved by an operator</li>
      <li>By default operators see last 20 Clients and Payments in the corresponding grids</li>
      <li>Internal transfer validation has been improved</li>
      <li>Credit-in/out Feature - Operators can manually add or subtract credit on clients Trading account</li>
      <li>New payment flow with support of Naspay cashier has been implemented</li>
      <li>Payment transactions search has been improved</li>
      <li>Credit IN and OUT transactions are now available in transactions history of the client</li>
      <li>Callbacks - Calendar view</li>
      <li>Client search - Filter by KYC status</li>
      <li>Client search - Filter Clients by FTD (yes/no)</li>
      <li>Client search - Filter clients by Sales and Retention statuses</li>
      <li>Client search - Filter Assigned/Unassigned has been improvement</li>
    </ul>

    <h1>Release notes 11/Dec/18 - Version 2</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Callbacks can now be seen in clients profile in Backoffice</li>
      <li>Leads can now be assign to an agent by upload of the CSV file</li>
      <li>You can filter clients by choosing Assigned or Unassigned to an agent</li>
    </ul>

    <h1>Release notes 04/Dec/18 - Version 1</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Last 10 registrations, deposits, and withdrawals are displayed on Backoffice dashboard based on Hierarchy</li>
      <li>Lead Upload Example Template has been added</li>
      <li>Clients Sales Status can be changed from his Profile</li>
      <li>Client can be assigned to an operator from his profile</li>
      <li>Separation lines has been added to all grids in Backoffice</li>
      <li>Authentication security has been improvement</li>
    </ul>

    <h2>Bugs & Fixes</h2>
    <ul>
      <li>Bugs on Hierarchy has been fixed</li>
    </ul>

    <h1>Release notes - Version Alpha MVP</h1>
    <h2>What has been done</h2>
    <ul>
      <li>Bulk action on clients - now you can perform bulk actions on selected clients</li>
      <li>We have configured payments via Naspay</li>
      <li>Clients search allows to search for clients by UUID, Email and Name</li>
      <li>Client portal has been created</li>
      <li>
        Create an MT4 Trading Account and update it&apos;s password right from the client&apos;s profile in Backoffice
      </li>
      <li>Manual Deposit & Withdrawal feature has been added</li>
      <li>Uploaded documents can now be validated in Backoffice</li>
      <li>Clients can be seen as a list in Backoffice</li>
      <li>You can search Leads by Email, Name or Phone</li>
      <li>Trading History can now be reviewed in clients profile</li>
    </ul>
  </Fragment>
);

export default ReleaseNotes;
