import React, { Fragment } from "react";

const ReleaseNotes = () => (
  <Fragment>
    <h1>Falcon CRM - Release notes</h1>
    <br />
    <h1>2/Apr/19 - Version 17</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Add existing operator to additional brand</p>
      </li>
      <li>
        <p>Affiliate partners displayed in Hierarchy</p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Show only current brand&rsquo;s offices/desks/teams</p>
      </li>
      <li>
        <p>Wrong trading history information displayed in CP and BO</p>
      </li>
      <li>
        <p>Update phone number fixed in client profile</p>
      </li>
      <li>
        <p>Fixed problem entering payment amount with cents</p>
      </li>
      <li>
        <p>Fixed - Payment doesn&rsquo;t have original agent</p>
      </li>
    </ul>
    <h1>19/Mar/19 - Version 16</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Password validation on client portal changed</p>
        <ul>
          <li>
            <p>min. 6 signs, min. 1 letter, min. 1 number</p>
          </li>
        </ul>
      </li>
      <li>
        <p>New retention statuses added</p>
        <ul>
          <li>
            <p>Invalid, Active, Deposit with me, Recover, No answer</p>
          </li>
        </ul>
      </li>
      <li>
        <p>New sales statuses added</p>
        <ul>
          <li>
            <p>High potential, Low potential, Converted, Callback</p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          Password validation errors on client portal translated to all
          languages
        </p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Lead profile - desk and team name will be displayed correctly</p>
      </li>
      <li>
        <p>Operator profile visibility is fixed</p>
      </li>
      <li>
        <p>
          Default operator will be removed or reassigned from hierarchy branch
          if this operator was removed from hierarchy branch
        </p>
      </li>
      <li>
        <p>
          Operators with the same email can't be created on the same environment
        </p>
      </li>
      <li>
        <p>Payment country will always be the same as client's country</p>
      </li>
      <li>
        <p>Client search by name was optimized</p>
      </li>
      <li>
        <p>Fix on normalized amount in payments</p>
      </li>
      <li>
        <p>Fix on affiliate detail information</p>
      </li>
    </ul>
    <h1>12/Mar/19 - Version 15</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>
          Sales status and Notes can be enabled for affiliate partners in
          partner profile
        </p>
      </li>
      <li>
        <p>
          Dashboards are showing correct numbers - transactions with payment
          method &ldquo;Bonus&quot; are ignored
        </p>
      </li>
      <li>
        <p>
          Affiliate Partner's are created in the Affiliate partner department by
          default
        </p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Client Profile Notes tab - Date Range filter fixed</p>
      </li>
      <li>
        <p>Client grid fixes</p>
      </li>
      <li>
        <p>
          Clients search by email improved
          <br />
        </p>
      </li>
    </ul>
    <h1>05/Mar/19 - Version 14</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Release notes are available in Backoffice</p>
      </li>
      <li>
        <p>Identification fields are added to client profile</p>
      </li>
      <li>
        <p>Payretailers option added in the Payment method filter</p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>
          The ability to change Sales representative on Lead profile is fixed
        </p>
      </li>
      <li>
        <p>Operator creation is fixed</p>
      </li>
      <li>
        <p>Problem with feed search by action types if solved</p>
      </li>
    </ul>
    <h1>26/Feb/19 - Version 13</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Dashboards are improved and showing numbers based on hierarchy</p>
      </li>
      <li>
        <p>Client can be searched by Source and Affiliate ID</p>
      </li>
      <li>
        <p>
          Operator will not be auto assigned to Office/Desk/Team on it's
          creation
        </p>
      </li>
      <li>
        <p>Leads self-conversion is improved</p>
        <ul>
          <li>
            <p>
              When lead making registration on CP he will be auto assigned to
              the same sale agent as the lead was
            </p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          Clients and Operators who has been blocked by &quot;too many
          attempts&quot; can now be unblocked in corresponding profile
        </p>
      </li>
      <li>
        <p>Simple passwords are allowed for clients </p>
        <ul>
          <li>
            <p>min. 6 symbols, min. 1 letter, min. 1 number</p>
          </li>
        </ul>
      </li>
      <li>
        <p>
          On operator creation it is required to assign him to any hierarchy
          branch
        </p>
      </li>
      <li>
        <p>Client search - Search by email was improved</p>
      </li>
      <li>
        <p>
          Clients are being redirected to finance page of the Client portal
          after autologin (For registrations via affiliate API)
        </p>
      </li>
      <li>
        <p>
          Sales and Retention agents are not allowed to make manual transaction
        </p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>
          Operator names were sometimes hidden in clients profile and hierarchy
          tree - fixed
        </p>
      </li>
      <li>
        <p>Leads - Lead Profile update was fixed</p>
      </li>
      <li>
        <p>Leads - Leads gender can be saved to his profile</p>
      </li>
      <li>
        <p>Leads - Search by email works correct</p>
      </li>
      <li>
        <p>Clients Search - Preloader on grid was fixed</p>
      </li>
      <li>
        <p>
          Leads emails uniqueness is guaranteed for a brand not for environment
        </p>
      </li>
      <li>
        <p>Language name are not shortened on Client portal any more</p>
      </li>
      <li>
        <p>
          On assign of an agent the acquisition status will not change any more
        </p>
      </li>
      <li>
        <p>Clients reassignment by the CRM is fixed</p>
      </li>
      <li>
        <p>Leads - Leads Upload improved</p>
      </li>
      <li>
        <p>Client searching by range of balances is fixed</p>
      </li>
      <li>
        <p>Office creation is fixed</p>
      </li>
    </ul>
    <h1>19/Feb/19 - Version 12</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Clients - Bulk Assignment of clients to multiple Operators</p>
      </li>
      <li>
        <p>Payments - Canceled transactions have corresponding status</p>
      </li>
      <li>
        <p>Payments - Bonus payment method added</p>
      </li>
      <li>
        <p>Password generator improved</p>
      </li>
    </ul>
    <h1>12/Feb/19 - Version 11</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Leads - Filter leads by account status</p>
      </li>
      <li>
        <p>Payments - Set reason on Withdrawal rejection</p>
      </li>
      <li>
        <p>Clients search - Filter clients by assigned operators</p>
      </li>
      <li>
        <p>
          Clients search - Limit filter allow to limit an amount of found
          clients
        </p>
      </li>
      <li>
        <p>
          On client creation rules will be ignored if lead with the same email
          has assigned sales agent, so that client will get the same sales agent
          assigned
        </p>
      </li>
      <li>
        <p>
          Affiliate API - Allows to register clients via API, get clients of the
          affiliate and get client's details by email or UUID
        </p>
      </li>
      <li>
        <p>
          Affiliate API - Autologin link will be sent in response to successful
          client signup via API
        </p>
      </li>
      <li>
        <p>Leads - Limit filter allow to limit the amount of found leads</p>
      </li>
      <li>
        <p>Leads - Converted by operator on leads is being shown in the grid</p>
      </li>
      <li>
        <p>
          Ability to manage restricted countries and white listed IPs for
          affiliates was added
        </p>
      </li>
      <li>
        <p>
          Hierarchy - Operators' assigned Brands / Desks / Teams can be reviewed
          and changed in operators profile
        </p>
      </li>
      <li>
        <p>
          Temporary solution on Multi-Currency - client can choose currency on
          sign up, but can have MT4 trading accounts in his profiles currency
          only.
        </p>
      </li>
      <li>
        <p>
          The ability to have a MT4 accounts in different currencies by creating
          multiple client profiles
        </p>
      </li>
      <li>
        <p>Leads - Search for Leads by Source and Affiliate</p>
      </li>
      <li>
        <p>Lead UUID will be displayed in clients profile after conversion</p>
      </li>
      <li>
        <p>
          Operator who created Office, Desk or Team will not be assigned to it
          any more
        </p>
      </li>
      <li>
        <p>Leads profile can be opened in a new browser tab</p>
      </li>
      <li>
        <p>Affiliate will be displayed in clients grid and client profile</p>
      </li>
      <li>
        <p>Client Portal - Right to left languages support added</p>
      </li>
      <li>
        <p>
          Client Portal - Russian, Chinise, Italian, Arabic, German and Spanish
          languages has been added
        </p>
      </li>
      <li>
        <p>
          &quot;Backoffice has been updated&quot; and &quot;Client portal has
          been updated&quot; popups has been added to prevent users of using old
          version of application.
        </p>
      </li>
      <li>
        <p>Payments - Payment method filter got multiselect option</p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Filtering by Desk and Teams is fixes</p>
      </li>
      <li>
        <p>Clients search - Search by first and last name fixed</p>
      </li>
      <li>
        <p>Leads - Saving personal details fixed</p>
      </li>
      <li>
        <p>Clients search - Clients can be filtered by balance amount range</p>
      </li>
      <li>
        <p>Leads - Sales status filter fixed</p>
      </li>
      <li>
        <p>
          Permissions - Retention and Sales agents can't see the Hierarchy
          section in Backoffice
        </p>
      </li>
      <li>
        <p>
          Client portal - Deposit flow has been simplified. Client does not have
          to select payment method.
        </p>
      </li>
    </ul>
    <h1>05/Feb/19 - Version 10</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Leads - Filter leads by assigned operators</p>
      </li>
      <li>
        <p>
          Payments - Electronic payment and None payment methods are added for
          manual transactions
        </p>
      </li>
      <li>
        <p>Leads optimization - 10x performance grow</p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Hierarchy - Operators are being shown based on Hierarchy</p>
      </li>
    </ul>
    <h1>29/Jan/19 - Version 9</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>
          Emails will convert to lowercase on search and email change. Old
          emails on production are migrated to lowercase.
        </p>
      </li>
      <li>
        <p>
          Retention manager is able to change retention status in clients grid
          and profile
        </p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Leads - Sales status filter fixed</p>
      </li>
    </ul>
    <h1>22/Jan/19 - Version 8</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Clients search - Desks and teams are displayed on client grid</p>
      </li>
      <li>
        <p>
          Leads - Assign sales agents and change sales status from leads profile
        </p>
      </li>
      <li>
        <p>Leads - Assign of selected leads to many operators</p>
      </li>
      <li>
        <p>Leads - Desk, team and assignee name are displayed in leads grid</p>
      </li>
      <li>
        <p>White list of IPs limits access to Backoffice</p>
      </li>
      <li>
        <p>Notes - Notes on lead's profile</p>
      </li>
      <li>
        <p>Leads - individual assign to sales agent from leads profile</p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Lead search by phone fixed</p>
      </li>
      <li>
        <p>Lead to client promotion improved</p>
      </li>
      <li>
        <p>Filtering clients by Desk and Team is fixed</p>
      </li>
      <li>
        <p>Lead personal details are transferring to clients details</p>
      </li>
      <li>
        <p>Client Portal Signup form fixed</p>
      </li>
      <li>
        <p>
          Payments - Decimals are now allowed to enter in manual transaction
          amount field
        </p>
      </li>
      <li>
        <p>Error messages are improved on leads CSV file uploads</p>
      </li>
    </ul>
    <h1>15/Jan/19 - Version 7</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>
          Leads - Lead's sales representative name is displayed in leads grid
          and profile
        </p>
      </li>
      <li>
        <p>
          Payments - Error message is displayed on failed payment transactions
        </p>
      </li>
      <li>
        <p>Leads - Assign of selected leads to many agents with equally</p>
      </li>
      <li>
        <p>Hierarchy - Ability to add an Operator to the Desk or Team</p>
      </li>
      <li>
        <p>
          Notes - Payment transactions internal note can be added, changed and
          deleted
        </p>
      </li>
      <li>
        <p>Payments - Filter payment transactions by Original agent</p>
      </li>
      <li>
        <p>Clients search - Search clients by phone or alternative phone</p>
      </li>
      <li>
        <p>
          Dashboard - Only completed deposits/withdrawals are displayed on
          dashboard
        </p>
      </li>
      <li>
        <p>Documents - Preview of uploaded files</p>
      </li>
      <li>
        <p>Leads - Bulk assign to sales agent</p>
      </li>
      <li>
        <p>
          Leads - Set status Converted on leads profile, while client signed up
          with the same email
        </p>
      </li>
      <li>
        <p>Payments - Filter payment transactions by list of Original Agents</p>
      </li>
      <li>
        <p>
          Hierarchy - Ability to add an operator to Brand/Office/Desk/Team on
          it's creation
        </p>
      </li>
      <li>
        <p>Notes - Ability to add a note on callbacks</p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Payments - Original agent is now showing on manual transactions</p>
      </li>
      <li>
        <p>Language on client profile can now be updated</p>
      </li>
      <li>
        <p>Credit balance is displayed on trading account</p>
      </li>
      <li>
        <p>Payments - Amount range filter is fixed</p>
      </li>
      <li>
        <p>Client search - Reset filters button fixed</p>
      </li>
      <li>
        <p>Logged out operator are being redirected to the login page</p>
      </li>
      <li>
        <p>Leads - Promotion of lead to client is fixed</p>
      </li>
    </ul>
    <h1>08/Jan/19 - Version 6</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Leads - CSV upload improvement</p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Payments - Deposit has been fixed</p>
      </li>
    </ul>
    <h1>01/Jan/19 - Version 5</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>
          Payments - Original Agent of transaction is being stored and displayed
          in transaction details
        </p>
      </li>
      <li>
        <p>
          Callbacks - Personal calendar is available at the header of Backoffice
        </p>
      </li>
      <li>
        <p>
          Universal sales and retention rules for all countries and languages
        </p>
      </li>
      <li>
        <p>Total credit amount is shown at clients profile header</p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Trades volume(Size) is displayed correctly</p>
      </li>
      <li>
        <p>Client portal - Sign-up is fixed</p>
      </li>
      <li>
        <p>Leads - CSV upload without phone codes</p>
      </li>
      <li>
        <p>Usability - Filter was improved to be easy cleared</p>
      </li>
      <li>
        <p>Callbacks date range filter fixed</p>
      </li>
      <li>
        <p>Payments - Manual transactions can now be filtered</p>
      </li>
    </ul>
    <h1>25/Dec/18 - Version 4</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>
          Payments - External Reference ID are displayed in transactions details
        </p>
      </li>
      <li>
        <p>
          Payments - Last 10 Deposits and Withdrawals on dashboard are displayed
          based on Hierarchy
        </p>
      </li>
      <li>
        <p>
          Leads - By default 20 last added Leads are displayed in leads grid
        </p>
      </li>
      <li>
        <p>
          Hierarchy visualization feature allows to see the hierarchy structure
        </p>
      </li>
      <li>
        <p>Approve and Reject of Withdrawal requests has been improved</p>
      </li>
      <li>
        <p>MT4 - Trading account password can be changed in clients profile</p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Payments search has been fixed</p>
      </li>
      <li>
        <p>Leads search has been fixed</p>
      </li>
      <li>
        <p>Credit out validation has been fixed</p>
      </li>
    </ul>
    <h1>18/Dec/18 - Version 3</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Dashboard charts sections has been redesigned</p>
      </li>
      <li>
        <p>Withdrawal requests can now be approved by an operator</p>
      </li>
      <li>
        <p>
          By default operators see last 20 Clients and Payments in the
          corresponding grids
        </p>
      </li>
      <li>
        <p>Internal transfer validation has been improved</p>
      </li>
      <li>
        <p>
          Credit-in/out Feature - Operators can manually add or subtract credit
          on clients Trading account
        </p>
      </li>
      <li>
        <p>
          New payment flow with support of Naspay cashier has been implemented
        </p>
      </li>
      <li>
        <p>Payment transactions search has been improved</p>
      </li>
      <li>
        <p>
          Credit IN and OUT transactions are now available in transactions
          history of the client
        </p>
      </li>
      <li>
        <p>Callbacks - Calendar view</p>
      </li>
      <li>
        <p>Client search - Filter by KYC status</p>
      </li>
      <li>
        <p>Client search - Filter Clients by FTD (yes/no)</p>
      </li>
      <li>
        <p>Client search - Filter clients by Sales and Retention statuses</p>
      </li>
      <li>
        <p>Client search - Filter Assigned/Unassigned has been improvement</p>
      </li>
    </ul>
    <h1>11/Dec/18 - Version 2</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Callbacks can now be seen in clients profile in Backoffice</p>
      </li>
      <li>
        <p>Leads can now be assigned to an agent by upload of the CSV file</p>
      </li>
      <li>
        <p>
          You can filter clients by choosing Assigned or Unassigned to an agent
        </p>
      </li>
    </ul>
    <h1>04/Dec/18 - Version 1</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>
          Last 10 registrations, deposits, and withdrawals are displayed on
          Backoffice dashboard based on Hierarchy
        </p>
      </li>
      <li>
        <p>Lead Upload Example Template has been added</p>
      </li>
      <li>
        <p>Clients Sales Status can be changed from his Profile</p>
      </li>
      <li>
        <p>Client can be assigned to an operator from his profile</p>
      </li>
      <li>
        <p>Separation lines has been added to all grids in Backoffice</p>
      </li>
      <li>
        <p>Authentication security has been improvement</p>
      </li>
    </ul>
    <h2>Bugs &amp; Fixes</h2>
    <ul>
      <li>
        <p>Bugs on Hierarchy has been fixed</p>
      </li>
    </ul>
    <h1>Release notes - Version Alpha MVP</h1>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>
          Bulk action on clients - now you can perform bulk actions on selected
          clients
        </p>
      </li>
      <li>
        <p>We have configured payments via Naspay</p>
      </li>
      <li>
        <p>
          Clients search allows one to search for clients by UUID, Email and
          Name
        </p>
      </li>
      <li>
        <p>Client portal has been created</p>
      </li>
      <li>
        <p>
          Create an MT4 Trading Account and update it's password right from the
          client's profile in Backoffice
        </p>
      </li>
      <li>
        <p>Manual Deposit &amp; Withdrawal feature has been added</p>
      </li>
      <li>
        <p>Uploaded documents can now be validated in Backoffice</p>
      </li>
      <li>
        <p>Clients can be seen as a list in Backoffice</p>
      </li>
      <li>
        <p>You can search Leads by Email, Name or Phone</p>
      </li>
      <li>
        <p>Trading History can now be reviewed in clients profile</p>
      </li>
    </ul>
    <p>
      <br />
      <br />
    </p>
  </Fragment>
);

export default ReleaseNotes;
