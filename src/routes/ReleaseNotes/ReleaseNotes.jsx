/* eslint-disable */
import React, { Fragment } from 'react';
import { startCase } from 'lodash';
import { getBackofficeBrand } from '../../config';

const ReleaseNotes = () => (
  <Fragment>
    <h1>{startCase(getBackofficeBrand().id)} CRM<br/>Release notes</h1>

    <hr/>

    <h2>1/October/20 - Version 47</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Implemented keeping of filtering result after page refresh on several pages: Search clients , KYC documents, Trading accounts</p>
      </li>
      <li>
        <p>Extended set of parameters for Didlogic</p>
      </li>
      <li>
        <p>Redirection to main page of Client Portal after clicking on logo</p>
      </li>
      <li>
        <p>On Partner profile page added a link to share with clients for their sign up. After sign up client will refer to this partner</p>
      </li>
    </ul>
    <h2>Bugs and Fixes</h2>
    <ul>
      <li>
        <p>Fixed problem with logout from Status</p>
      </li>
      <li>
        <p>Fixed with callback error</p>
      </li>
    </ul>

    <hr/>

    <h2>24/September/20 - Version 46</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Added feed tab to Lead profile page</p>
      </li>
      <li>
        <p>Added new sales status &ldquo;Wire Sent&ldquo; to BO</p>
      </li>
    </ul>
    <h2>Bugs and Fixes</h2>
    <ul>
      <li>
        <p>Fixed issue with the deposit&rsquo;s number сalculation</p>
      </li>
    </ul>

    <hr/>

    <h2>11/September/20 - Version 45</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Request callback feature</p>
      </li>
      <li>
        <p>New hierarchy tree structure on Backoffice</p>
      </li>
    </ul>
    <h2>Bugs and Fixes</h2>
    <ul>
      <li>
        <p>Fixed Miss match between email validation on Client Portal and Affiliate API</p>
      </li>
    </ul>

    <hr/>

    <h2>7/September/20 - Version 44</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Created referral program functionality</p>
      </li>
      <li>
        <p>Implemented Didlogic integration</p>
      </li>
      <li>
        <p>Bulk assign limit increased from 2000 to 5000 items</p>
      </li>
      <li>
        <p>Obligatory password expiration for operators accounts (one time per 30 days)</p>
      </li>
      <li>
        <p>Implemented a strong password pattern for BO</p>
      </li>
      <li>
        <p>Added captcha for sign up page</p>
      </li>
      <li>
        <p>Added &lsquo;read/unread&rsquo; filter to notification pop-up</p>
      </li>
      <li>
        <p>Automatic delete of notifications older than 3 months</p>
      </li>
      <li>
        <p>Use MT4 account instead UUID on Trading account Page for search</p>
      </li>
      <li>
        <p>Added rate limiter for reset password endpoint</p>
      </li>
      <li>
        <p>Removed Withdraw Status filter from Payment filters</p>
      </li>
    </ul>
    <h2>Bugs and Fixes</h2>
    <ul>
      <li>
        <p>Leads sort by Last Note does not applied to the next pages - fixed</p>
      </li>
      <li>
        <p>Added max length validation to search by fields on Clients page</p>
      </li>
    </ul>

    <hr/>


    <h2>24/July/20 - Version 43</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Added scheduler for client stream restriction via Non-Public Affiliate API</p>
      </li>
      <li>
        <p>Added sorting option via last note date to Lead page</p>
      </li>
      <li>
        <p>Implemented desk &amp; team filtration on Lead page</p>
      </li>
    </ul>
    <h2>Bugs and Fixes</h2>
    <ul>
      <li>
        <p>Unified behavior of "Apply" button on pages with grids</p>
      </li>
      <li>
        <p>Fixed issue with KYC filter</p>
      </li>
    </ul>

    <hr/>


    <h2>13/July/20 - Version 42</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Added "Online/Offline" filter to Search Client Page</p>
      </li>
      <li>
        <p>Implemented safe filters functionality on the "Payments" page</p>
      </li>
      <li>
        <p>To show 'Last Note" author name on Clients/Leads table</p>
      </li>
      <li>
        <p>Implemented notifications to an operator about new clients</p>
      </li>
      <li>
        <p>Added email notification function about trading account opening</p>
      </li>
      <li>
        <p>Implemented notifications to an operator when the client has a margin level under 100% on some trading account</p>
      </li>
      <li>
        <p>Added ability for an operator to see current client location on Client Portal website</p>
      </li>
    </ul>
    <h3>Bugs and Fixes</h3>
    <ul>
      <li>
        <p>Fixed bug with import new lead csv file upload</p>
      </li>
      <li>
        <p>Changed max amount of clients/leads that could be assigned at once: from 10k to 2k</p>
      </li>
      <li>
        <p>Fixed timezone issue</p>
      </li>
      <li>
        <p>Fixed DateTo time display issue</p>
      </li>
    </ul>

    <hr/>


    <h2>29/June/20 - Version 41</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Improved performance</p>
      </li>
    </ul>
    <h3>Bugs and Fixes</h3>
    <ul>
      <li>
        <p>Fixed small layout issues</p>
      </li>
      <li>
        <p>Fixed some permissions issues</p>
      </li>
    </ul>

    <hr/>

    <h2>28/May/20 - Version 40</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Callback reminder functionality</p>
      </li>
      <li>
        <p>Trading account page in BO</p>
      </li>
    </ul>
    <h2>Bugs and Fixes</h2>
    <ul>
      <li>
        <p>Fixed incorrect display for big notes on Clients and Leads Page</p>
      </li>
    </ul>

    <hr/>

    <h2>11/May/20 - Version 39</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Extended the "Feed" tab functionality (implemented 2-nd part)</p>
      </li>
      <li>
        <p>Show Client&rsquo;s timezone</p>
      </li>
      <li>
        <p>Added Client 's timezone param in Affiliate and Public API</p>
      </li>
      <li>
        <p>Implemented asterisk dialer</p>
      </li>
      <li>
        <p>Added ability to set a branch manager</p>
      </li>
    </ul>
    <h2>Bugs and Fixes</h2>
    <ul>
      <li>
        <p>Fixed bug with client sign up</p>
      </li>
      <li>
        <p>Fixed bug with connected with sorting by multiple params</p>
      </li>
      <li>
        <p>Fixed bug with occasional logout when change brands on BO</p>
      </li>
      <li>
        <p>Fixed bug with payment statistics on the dashboard</p>
      </li>
      <li>
        <p>Corrected leverage value in change leverage history</p>
      </li>
    </ul>

    <hr/>

    <h2>14/Apr/20 - Version 38</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Implemented functionality to distribute incoming client traffic between sales operators in BO according to certain percentage sales rules</p>
      </li>
      <li>
        <p>Created notification section in BO</p>
      </li>
      <li>
        <p>Payment method API adjustment to choose the specific payment method</p>
      </li>
    </ul>
    <h3>Bugs and Fixes</h3>
    <ul>
      <li>
        <p>Changed headers' text in "Social Trading" tab in BO</p>
      </li>
      <li>
        <p>Fixed data issues with dashboards in BO</p>
      </li>
      <li>
        <p>Fixed issue with displaying incorrect information about change leverage request</p>
      </li>
    </ul>

    <hr/>

    <h2>03/Apr/20 - Version 37</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Added satellite creation option during affiliate creation with custom email templates for satellite&rsquo;s clients</p>
      </li>
      <li>
        <p>Extended the "Feed" tab functionality (implemented 1-st part)</p>
      </li>
      <li>
        <p>Added 'Change leverage' functionality</p>
      </li>
      <li>
        <p>Implemented auto-creation EUR mt4 account after client Sign Up.</p>
      </li>
      <li>
        <p>Prohibition for an Affiliate to create the Clients if his permission to do so has been revoked</p>
      </li>
    </ul>
    <h2>Bugs and Fixes</h2>
    <ul>
      <li>
        <p>Fixed error when an operator tries to promote lead to client</p>
      </li>
      <li>
        <p>Fixed disability to select one client on Search Client page</p>
      </li>
      <li>
        <p>Fixed bug with leads filtering by sales status on Leads page</p>
      </li>
    </ul>

    <hr/>

    <h2>29/Mar/20 - Version 36</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Implemented MT5 integration</p>
      </li>
      <li>
        <p>Added &lsquo;Social Trading&rsquo; tab on &lsquo;Client&rsquo;s details&rsquo; page in BO</p>
      </li>
      <li>
        <p>Added &lsquo;KYC Note&rsquo; field to the "Files" tab on the "Client's details" page in BO</p>
      </li>
      <li>
        <p>Implemented search by partial parameters on &lsquo;Client&rsquo;s Search' and 'Lead&rsquo; pages</p>
      </li>
      <li>
        <p>Added sorting options to the BO 'Payments' and 'Search clients' pages on some fields</p>
      </li>
      <li>
        <p>Added new sales status to filters on &lsquo;Client&rsquo;s Search' page (Dialer NA, Dialer New, Dialer Assigned, Dialer Failed, Dialer Drop)</p>
      </li>
      <li>
        <p>Added the possibility to change email for clients from BackOffice for Admin and CS Role4.</p>
      </li>
    </ul>
    <h2>Bugs and Fixes</h2>
    <ul>
      <li>
        <p>Fixed problem with opening note on payments grid</p>
      </li>
      <li>
        <p>Fixed issue with a disability of CS4 to upload attachments</p>
      </li>
      <li>
        <p>Fixed issues with stuck Trades in PENDING status</p>
      </li>
      <li>
        <p>Fixed issue with default sort at client grid</p>
      </li>
      <li>
        <p>Fixed Error with list pagination on Payments tab on Client&rsquo;s page</p>
      </li>
    </ul>

    <hr/>

    <h2>12/Mar/20 - Version 35</h2>
    <h2>What has been done</h2>
    <ul>
      <li>
        <p>Reconciliation of credit card name vs player name</p>
      </li>
      <li>
        <p>Ability to see Client&rsquo;s last activity and current state (Online or Offline)</p>
      </li>
      <li>
        <p>Ability to create/update Partners for CellXpert</p>
      </li>
      <li>
        <p>Added 'Do not call' select option to 'Retention Status' filter</p>
      </li>
      <li>
        <p>Added 'Created by' filter to 'Search Clients' page</p>
      </li>
      <li>
        <p>Update Status button on CP</p>
      </li>
    </ul>
    <h2>Bugs and Fixes</h2>
    <ul>
      <li>
        <p>Rename "Passport"-related filters in the "Profile" tab</p>
      </li>
      <li>
        <p>Fixed bug with &ldquo;Search by country&rdquo; filter dropdown</p>
      </li>
      <li>
        <p>Added 'Identification Number' field to the 'Profile' tab in the BO</p>
      </li>
      <li>
        <p>Fixed GDPR -&gt; SMS checkbox issues after sign-up</p>
      </li>
    </ul>

    <hr/>

    <h2>5/Mar/20 - Version 34</h2>


    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Ability to create Clients through public API</p>
      </li>
      <li>
        <p>Created API For DidLogic integration</p>
      </li>
    </ul>


    <h3>Bugs and Fixes</h3>

    <ul>
      <li>
        <p>Changed texts on KYC verification pages</p>
      </li>
    </ul>

    <hr/>

    <h1>26/Feb/20 - Version 33</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Inactivity fee</p>
      </li>
      <li>
        <p>Automated creation of the MT4 Trading Account</p>
      </li>
      <li>
        <p>New (updated) Partners (Affiliates) creation flow</p>
      </li>
      <li>
        <p>Automated email sending once the MT4 Trading Account has been created</p>
      </li>
      <li>
        <p>BCC generation to the brand support on templated email sending event</p>
      </li>
      <li>
        <p>Disable of &lsquo;Social Trading&rsquo; feature for those Client&rsquo;s whose KYC Status is not &lsquo;APPROVED&rsquo;</p>
      </li>
    </ul>


    <h2>Bugs and Fixes</h2>

    <ul>
      <li>
        <p>Disable of the &lsquo;Confirm&rsquo; button in Credit out transaction modal in the Backoffice if the credit funds are insufficient</p>
      </li>
      <li>
        <p>Disable of &lsquo;Reset password&rsquo; function for Partners (Affiliates)</p>
      </li>
      <li>
        <p>Fix of selecting the Trading Activity details depending on the Trading Account type ('LIVE'/'DEMO')</p>
      </li>
    </ul>

    <hr/>


    <h1>13/Feb/20 - Version 32</h1>


    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Templated emails functionality</p>
      </li>
      <li>
        <p>Disable specific fields in the "Personal Info" subitem</p>
      </li>
    </ul>


    <h3>Bugs and Fixes</h3>

    <ul>
      <li>
        <p>&nbsp;Fix support service for mt4 account archiving</p>
      </li>
    </ul>

    <hr/>


    <h1>05/Feb/20 - Version 31</h1>


    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Hide Subject and Body field names from pinned notes area on profile</p>
      </li>
      <li>
        <p>Disable "Address Verification" category call to ShuftiPro and modify request.</p>
      </li>
      <li>
        <p>"Total deposit"/"Total withdrawal"/"Net deposit" parameters values</p>
      </li>
    </ul>


    <h2>Bugs and Fixes</h2>

    <ul>
      <li>
        <p>Show correct error message when Client try to upload file in the wrong format</p>
      </li>
      <li>
        <p>Fix an error that breaks Profile page when clicking on different Profile tabs</p>
      </li>
    </ul>

    <hr/>


    <h1>31/Jan/20 - Version 30</h1>


    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Add ability to copy Trade ID in trade update modal</p>
      </li>
      <li>
        <p>Fix permission for operators</p>
      </li>
      <li>
        <p>Affiliate flow refactoring</p>
      </li>
      <li>
        <p>Forbid to move files uploaded by a Client on FE</p>
      </li>
      <li>
        <p>Extend max length for affiliate source field for profile service</p>
      </li>
      <li>
        <p>Add trigger to send an email after PAMM Investor account creation</p>
      </li>
      <li>
        <p>Build new MiniProfile component</p>
      </li>
      <li>
        <p>Filter "FTD date range" to Clients search</p>
      </li>
      <li>
        <p>Add "Other" category to the "Files" tab in the Backoffice FE Application</p>
      </li>
      <li>
        <p>"First date note" filter</p>
      </li>
      <li>
        <p>New filters ("Desks"/"Teams"/"FTD") to the Payments page</p>
      </li>
    </ul>


    <h2>Bugs and Fixes</h2>

    <ul>
      <li>
        <p>Wrong modificationTime update logic for payments</p>
      </li>
      <li>
        <p>Fix of the Payments page filters - when country was specified in lower case payment wasn&rsquo;t displayed on grid.</p>
      </li>
      <li>
        <p>Fix of the Client&rsquo;s page - "Verified" icon appears for alternative phone in Personal information section</p>
      </li>
      <li>
        <p>Operator with role CS Role4 `has been granted permission on BO delete note</p>
      </li>
      <li>
        <p>KYC Documents Fix. Filter doesnt work after Other &rarr; Other category choose</p>
      </li>
      <li>
        <p>Operator shall not be allowed to upload file in wrong format but in correct file extension</p>
      </li>
      <li>
        <p>Problem with multi assign and update sales status</p>
      </li>
      <li>
        <p>Fix the dashboard in BO, Latest 10 Deposits/Withdrawals/Registrations</p>
      </li>
      <li>
        <p>FIle Upload button has been disabled if file verification status is APPROVED</p>
      </li>
      <li>
        <p>Profile notes menu has been placed under the dropdown instead of note&rsquo;s footer.</p>
      </li>
      <li>
        <p>Operators who have no permissions to change KYC status were banned from doing so.</p>
      </li>
    </ul>

    <hr/>


    <h1>22/Dec/19 - Version 29</h1>


    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Demo trading account implementation</p>
      </li>
      <li>
        <p>Save filters for Operators</p>
      </li>
      <li>
        <p>Allow clients to cancel withdrawal requests in CP</p>
      </li>
      <li>
        <p>Change Original agent of specific transaction</p>
      </li>
      <li>
        <p>Documents section in Backoffice</p>
      </li>
      <li>
        <p>GDPR Cookies and SPAM links</p>
      </li>
      <li>
        <p>Allow clients to request leverage change on CP</p>
      </li>
      <li>
        <p>Send an email notification to the Client and Backoffice operators when a Client creates the Withdrawal request</p>
      </li>
      <li>
        <p>Automated Emails - Deposit/Withdrawal Completion/Failure notifications</p>
      </li>
      <li>
        <p>Automated Emails 3 - KYC Document Upload</p>
      </li>
      <li>
        <p>Automated Email 6 - Trigger Email - Clients above 10K</p>
      </li>
      <li>
        <p>Display notification before documents deleting.</p>
      </li>
      <li>
        <p>Send client's phone and gender in deposit request to NasPay</p>
      </li>
      <li>
        <p>Email notifications functionality has been implemented for the Clients and Backoffice operators for the following event: Client changes MT4 Trading account password</p>
      </li>
      <li>
        <p>Function for Operator to change the MT4 trading account password without restrictions</p>
      </li>
      <li>
        <p>Add MT4 comment for Transfer transactions</p>
      </li>
    </ul>


    <h2>Bugs and Fixes</h2>

    <ul>
      <li>
        <p>Message if a Client has requested to transfer more funds that he has on his Trading Account</p>
      </li>
      <li>
        <p>Fix of internal transfer</p>
      </li>
      <li>
        <p>Fix of the KYC documents upload from CP</p>
      </li>
      <li>
        <p>Displaying transaction date/ time / operator</p>
      </li>
      <li>
        <p>Payment status update after transaction completion</p>
      </li>
      <li>
        <p>Fix of the &lsquo;Save changes&rsquo; button (when changes have been applied)</p>
      </li>
      <li>
        <p>More Live trading accounts creation has been allowed</p>
      </li>
      <li>
        <p>Operator has been givena function to change the Client's password</p>
      </li>
      <li>
        <p>Increase of the number of characters to comment column (Service-trading_activity,table-trade_record)</p>
      </li>
      <li>
        <p>Fix of the last trade date filter</p>
      </li>
    </ul>

    <hr/>

    <h1>18/Sep/19 - Version 28</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Internal Transfer can be enabled/disabled per Client</p>
      </li>
      <li>
        <p>Limit on Trading Accounts, per client</p>
      </li>
      <li>
        <p>Limit on real and demo accounts, per brand</p>
      </li>
      <li>
        <p>Sales rules for an Operator</p>
      </li>
      <li>
        <p>Clients can enter their bank details information on Clients Portal</p>
      </li>
      <li>
        <p>CRS (Self certification) tick add to clients profile</p>
      </li>
      <li>
        <p>Clients and leads can have one assigned operator only</p>
      </li>
      <li>
        <p>Support of MOTO transactions</p>
      </li>
    </ul>

    <h2>Bugs and Fixes</h2>

    <ul>
      <li>
        <p>Client&rsquo;s deposits count update fixed</p>
      </li>
      <li>
        <p>Client's language is being updated correctly</p>
      </li>
      <li>
        <p>MOTO transactions can be recognized by "NasPay" aggrigator</p>
      </li>
      <li>
        <p>Trading can't be disabled for Demo accounts</p>
      </li>
      <li>
        <p>DEMO accounts are excluded from base balance calculation</p>
      </li>
    </ul>

    <hr/>

    <h1>29/August/19 - Version 27</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Leverage synchronization with MT4 replica</p>
      </li>
      <li>
        <p>Allow client to change password of his MT4 trading accounts on Client Portal</p>
      </li>
      <li>
        <p>Add search leads by source</p>
      </li>
      <li>
        <p>Add ability to change operator/partner password from Backoffice</p>
      </li>
      <li>
        <p>Deny a client profile creation if the country from the signup request is restricted</p>
      </li>
      <li>
        <p>Add filter &ldquo;Completed / Rejected date&rdquo; to Payments in Backoffice</p>
      </li>
      <li>
        <p>Create Brand administrator role (Customer service : Role4) with all permissions in all services</p>
      </li>
      <li>
        <p>Add Rules section on Backoffice</p>
      </li>
    </ul>

    <h2>Bugs and Fixes</h2>

    <ul>
      <li>
        <p>Client Profile. Share Profile Link fixed</p>
      </li>
      <li>
        <p>Individual move to sales/retention on clients profile fixed</p>
      </li>
      <li>
        <p>Add insensitive check of restricted countries for partner's clients creation</p>
      </li>
    </ul>

    <hr/>


    <h1>18/July/19 - Version 26</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Client can cancel withdraw request on Client Portal</p>
      </li>
      <li>
        <p>Added Turkish locale for Client Portal</p>
      </li>
      <li>
        <p>Last comment date range filter on clients search</p>
      </li>
      <li>
        <p>Last trade date range filter on clients search</p>
      </li>
      <li>
        <p>Last modified date range filter on client search</p>
      </li>
      <li>
        <p>KYC Status changes to "Awaiting Review" when a client uploads a file</p>
      </li>
      <li>
        <p>Multi currency transfers in Backoffice</p>
      </li>
      <li>
        <p>Transfer with Fee transaction added for multi currency transfers</p>
      </li>
      <li>
        <p>Original agent can be changed on transaction details popup in Backoffice</p>
      </li>
    </ul>

    <h2>Bugs &amp; Fixes</h2>

    <ul>
      <li>
        <p>Fixed - Errors when client translates Client Portal with Google translate</p>
      </li>
    </ul>

    <hr/>

    <h1>11/July/19 - Version 25</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Option to select all items in multi select filters added</p>
      </li>
      <li>
        <p>Secondary email field in clients profile added</p>
      </li>
      <li>
        <p>Document upload texts on Client portal changed and translated</p>
      </li>
      <li>
        <p>Trading accounts are creating with client's transliterated full name</p>
      </li>
      <li>
        <p>New registered clients get KYC Status "No KYC"</p>
      </li>
      <li>
        <p>Restricted countries removed from &ldquo;Country&rdquo; dropdown on Client portal sign up form</p>
      </li>
      <li>
        <p>Hierarchy path on assigned branches in operator&rsquo;s profile</p>
      </li>
      <li>
        <p>Autologin url for Affiliate API</p>
      </li>
      <li>
        <p>Achievements on Client portal&rsquo;s dashboard page added</p>
      </li>
    </ul>

    <h2>Bugs &amp; Fixes</h2>

    <ul>
      <li>
        <p>Sales and retention managers is stored after applying retention rule</p>
      </li>
      <li>
        <p>User created improved</p>
      </li>
      <li>
        <p>Fix on removing a hierarchy branch on operators profile</p>
      </li>
    </ul>

    <hr/>

    <h1>27/June/19 - Version 24</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Multilanguage autologin - Client portal opens in a defined by affiliate language</p>
      </li>
      <li>
        <p>Multicurrency profiles - an ability for a client to have trading accounts in different currencies</p>
      </li>
      <li>
        <p>Search clients by MT4 trading account ID</p>
      </li>
      <li>
        <p>Trades details are being recalculated on Swap updates</p>
      </li>
      <li>
        <p>Removed currency on client portal signup</p>
      </li>
      <li>
        <p>Date, time and operator who have made status update of the transaction is being stored and displayed in Backoffice</p>
      </li>
    </ul>

    <h2>Bugs &amp; Fixes</h2>

    <ul>
      <li>
        <p>Operators in client search filter are being displayed correctly</p>
      </li>
      <li>
        <p>Inconsistency of balances - fixed</p>
      </li>
      <li>
        <p>Issue with selecting of operators which have the same name - resolved</p>
      </li>
      <li>
        <p>Client assign bug - fixed</p>
      </li>
      <li>
        <p>Client portal styling issues after implementation multi-currency - fixed</p>
      </li>
    </ul>

    <hr/>

    <h1>31/May/19 - Version 23</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>New Client Portal</p>
      </li>
      <li>
        <p>Script created for automatic creation of daily - clients reports</p>
      </li>
      <li>
        <p>Link added "new trading account" on deposit page of client portal in case if client does not have trading accounts</p>
      </li>
      <li>
        <p>FATCA form provided toggle in clients profile added</p>
      </li>
      <li>
        <p>Customer Service role created with requested permissions</p>
      </li>
      <li>
        <p>Translations to Chinese for Backoffice and Client Portal added</p>
      </li>
      <li>
        <p>Status webtrader button can be displayed on client portal per brand</p>
      </li>
    </ul>

    <h2>Bugs &amp; Fixes</h2>

    <ul>
      <li>
        <p>Client grid reloads after move client to sales or retention</p>
      </li>
      <li>
        <p>Multi assign bug - fixed</p>
      </li>
      <li>
        <p>Wrong assignment by rule - fixed</p>
      </li>
      <li>
        <p>Wrong transfer behavior on Client Portal - fixed</p>
      </li>
      <li>
        <p>Search filters on Partners - fixed</p>
      </li>
      <li>
        <p>Issue with bulk actions on limited searches of Clients and Leads - fixed</p>
      </li>
      <li>
        <p>Operator assigned to brand doesn't see all users - fixed</p>
      </li>
      <li>
        <p>Operator can't be set to brand/company - fixed</p>
      </li>
      <li>
        <p>An operator see clients and operators that he shouldn't - fixed</p>
      </li>
    </ul>

    <hr/>

    <h1>17/May/19 - Version 22</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Automatic refresh of the search results after a bulk action is applied</p>
      </li>
    </ul>

    <h2>Bugs &amp; Fixes</h2>

    <ul>
      <li>
        <p>Validation error on promote lead to client with Ukrainian language is fixed</p>
      </li>
      <li>
        <p>Affiliate partner can get clients with a lot of notes via API</p>
      </li>
      <li>
        <p>Customer service permissions for changing Desk, Team, Representative are set</p>
      </li>
      <li>
        <p>Client portal caching problem fixed</p>
      </li>
    </ul>

    <hr/>

    <h1>7/May/19 - Version 21</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Default Leverage per regulation can be defined per brand</p>
      </li>
      <li>
        <p>Transaction's status can be changed manually</p>
      </li>
      <li>
        <p>Client portal refactoring + responsive design</p>
      </li>
      <li>
        <p>Simplified first deposit flow in refactored client portal enabled</p>
      </li>
      <li>
        <p>Fields validation improved on new affiliate&rsquo;s client registration via API</p>
      </li>
      <li>
        <p>Trading accounts are being created with a default leverage of the group</p>
      </li>
    </ul>

    <h2>Bugs &amp; Fixes</h2>

    <ul>
      <li>
        <p>Problem with creating mt4 accounts fixed</p>
      </li>
      <li>
        <p>New team button works and team lists are fixed</p>
      </li>
      <li>
        <p>Affiliate API - Save birth date fixed</p>
      </li>
    </ul>

    <hr/>

    <h1>16/Apr/19 - Version 19</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Applications &amp; Webtrader buttons on client portal redesigned</p>
      </li>
      <li>
        <p>Leads will be assigned to a current operator if a non-existing operator was specified in the uploaded CSV file</p>
      </li>
      <li>
        <p>Terms &amp; Condition link on Client portal signup page added</p>
      </li>
      <li>
        <p>Assign lost in hierarchy clients to operators</p>
      </li>
      <li>
        <p>"CASHIER" option to the payment method filter added</p>
      </li>
    </ul>

    <h2>Bugs &amp; Fixes</h2>

    <ul>
      <li>
        <p>Assign and Reassigning clients flow is fixed</p>
      </li>
      <li>
        <p>Move client to another Acquisition status fixed</p>
      </li>
      <li>
        <p>Email validation on the Signin page fixed</p>
      </li>
    </ul>

    <hr/>

    <h1>09/Apr/19 - Version 18</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Rejection reason selection on withdrawal requests has been added</p>
      </li>
      <li>
        <p>Affiliate partner's API access can be blocked in operator&rsquo;s profile</p>
      </li>
      <li>
        <p>Migrated clients' password recovery flow has been implemented</p>
        <ul>
          <li>
            <p>Client who tries to login to client portal with his old password is asked to reset it for security reasons</p>
          </li>
        </ul>
      </li>
      <li>
        <p>Client search - Operators in status "inactive" and "closed" are highlighted with gray color in drop-down list on "Operator" filter</p>
      </li>
      <li>
        <p>Operators in status "inactive" and "closed" are hidden in assignment popup</p>
      </li>
      <li>
        <p>Payment methods Recall and Chargeback has been added on manual transactions</p>
      </li>
      <li>
        <p>Personal dashboard has been added from Metabase to CRM</p>
      </li>
      <li>
        <p>Hierarchy Tree allows to expand branches of hierarchy level by level</p>
      </li>
    </ul>

    <h2>Bugs &amp; Fixes</h2>

    <ul>
      <li>
        <p>Permissions fixes on front side based on departments and roles</p>
      </li>
      <li>
        <p>Language selection does not overlay notification icon in Client portal</p>
      </li>
      <li>
        <p>Lead/Clients - Operator filter is not being disabled when in Sales status filter any status was selected</p>
      </li>
      <li>
        <p>Client's personal info update fixed</p>
      </li>
    </ul>

    <hr/>

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

    <hr/>

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
        <p>Password validation errors on client portal translated to all languages</p>
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
        <p>Default operator will be removed or reassigned from hierarchy branch if this operator was removed from hierarchy branch</p>
      </li>
      <li>
        <p>Operators with the same email can't be created on the same environment</p>
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

    <hr/>

    <h1>12/Mar/19 - Version 15</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Sales status and Notes can be enabled for affiliate partners in partner profile</p>
      </li>
      <li>
        <p>Dashboards are showing correct numbers - transactions with payment method &ldquo;Bonus" are ignored</p>
      </li>
      <li>
        <p>Affiliate Partner's are created in the Affiliate partner department by default</p>
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
        <p>Clients search by email improved</p>
      </li>
    </ul>

    <hr/>

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
        <p>The ability to change Sales representative on Lead profile is fixed</p>
      </li>
      <li>
        <p>Operator creation is fixed</p>
      </li>
      <li>
        <p>Problem with feed search by action types if solved</p>
      </li>
    </ul>

    <hr/>

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
        <p>Operator will not be auto assigned to Office/Desk/Team on it's creation</p>
      </li>
      <li>
        <p>Leads self-conversion is improved</p>
        <ul>
          <li>
            <p>When lead making registration on CP he will be auto assigned to the same sale agent as the lead was</p>
          </li>
        </ul>
      </li>
      <li>
        <p>Clients and Operators who has been blocked by "too many attempts" can now be unblocked in corresponding profile</p>
      </li>
      <li>
        <p>Simple passwords are allowed for clients</p>
        <ul>
          <li>
            <p>min. 6 symbols, min. 1 letter, min. 1 number</p>
          </li>
        </ul>
      </li>
      <li>
        <p>On operator creation it is required to assign him to any hierarchy branch</p>
      </li>
      <li>
        <p>Client search - Search by email was improved</p>
      </li>
      <li>
        <p>Clients are being redirected to finance page of the Client portal after autologin (For registrations via affiliate API)</p>
      </li>
      <li>
        <p>Sales and Retention agents are not allowed to make manual transaction</p>
      </li>
    </ul>

    <h2>Bugs &amp; Fixes</h2>

    <ul>
      <li>
        <p>Operator names were sometimes hidden in clients profile and hierarchy tree - fixed</p>
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
        <p>Leads emails uniqueness is guaranteed for a brand not for environment</p>
      </li>
      <li>
        <p>Language name are not shortened on Client portal any more</p>
      </li>
      <li>
        <p>On assign of an agent the acquisition status will not change any more</p>
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

    <hr/>

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

    <hr/>

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
        <p>Clients search - Limit filter allow to limit an amount of found clients</p>
      </li>
      <li>
        <p>On client creation rules will be ignored if lead with the same email has assigned sales agent, so that client will get the same sales agent assigned</p>
      </li>
      <li>
        <p>Affiliate API - Allows to register clients via API, get clients of the affiliate and get client's details by email or UUID</p>
      </li>
      <li>
        <p>Affiliate API - Autologin link will be sent in response to successful client signup via API</p>
      </li>
      <li>
        <p>Leads - Limit filter allow to limit the amount of found leads</p>
      </li>
      <li>
        <p>Leads - Converted by operator on leads is being shown in the grid</p>
      </li>
      <li>
        <p>Ability to manage restricted countries and white listed IPs for affiliates was added</p>
      </li>
      <li>
        <p>Hierarchy - Operators' assigned Brands / Desks / Teams can be reviewed and changed in operators profile</p>
      </li>
      <li>
        <p>Temporary solution on Multi-Currency - client can choose currency on sign up, but can have MT4 trading accounts in his profiles currency only.</p>
      </li>
      <li>
        <p>The ability to have a MT4 accounts in different currencies by creating multiple client profiles</p>
      </li>
      <li>
        <p>Leads - Search for Leads by Source and Affiliate</p>
      </li>
      <li>
        <p>Lead UUID will be displayed in clients profile after conversion</p>
      </li>
      <li>
        <p>Operator who created Office, Desk or Team will not be assigned to it any more</p>
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
        <p>Client Portal - Russian, Chinise, Italian, Arabic, German and Spanish languages has been added</p>
      </li>
      <li>
        <p>"Backoffice has been updated" and "Client portal has been updated" popups has been added to prevent users of using old version of application.</p>
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
        <p>Permissions - Retention and Sales agents can't see the Hierarchy section in Backoffice</p>
      </li>
      <li>
        <p>Client portal - Deposit flow has been simplified. Client does not have to select payment method.</p>
      </li>
    </ul>

    <hr/>

    <h1>05/Feb/19 - Version 10</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Leads - Filter leads by assigned operators</p>
      </li>
      <li>
        <p>Payments - Electronic payment and None payment methods are added for manual transactions</p>
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

    <hr/>

    <h1>29/Jan/19 - Version 9</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Emails will convert to lowercase on search and email change. Old emails on production are migrated to lowercase.</p>
      </li>
      <li>
        <p>Retention manager is able to change retention status in clients grid and profile</p>
      </li>
    </ul>

    <h2>Bugs &amp; Fixes</h2>

    <ul>
      <li>
        <p>Leads - Sales status filter fixed</p>
      </li>
    </ul>

    <hr/>

    <h1>22/Jan/19 - Version 8</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Clients search - Desks and teams are displayed on client grid</p>
      </li>
      <li>
        <p>Leads - Assign sales agents and change sales status from leads profile</p>
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
        <p>Payments - Decimals are now allowed to enter in manual transaction amount field</p>
      </li>
      <li>
        <p>Error messages are improved on leads CSV file uploads</p>
      </li>
    </ul>

    <hr/>

    <h1>15/Jan/19 - Version 7</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Leads - Lead's sales representative name is displayed in leads grid and profile</p>
      </li>
      <li>
        <p>Payments - Error message is displayed on failed payment transactions</p>
      </li>
      <li>
        <p>Leads - Assign of selected leads to many agents with equally</p>
      </li>
      <li>
        <p>Hierarchy - Ability to add an Operator to the Desk or Team</p>
      </li>
      <li>
        <p>Notes - Payment transactions internal note can be added, changed and deleted</p>
      </li>
      <li>
        <p>Payments - Filter payment transactions by Original agent</p>
      </li>
      <li>
        <p>Clients search - Search clients by phone or alternative phone</p>
      </li>
      <li>
        <p>Dashboard - Only completed deposits/withdrawals are displayed on dashboard</p>
      </li>
      <li>
        <p>Documents - Preview of uploaded files</p>
      </li>
      <li>
        <p>Leads - Bulk assign to sales agent</p>
      </li>
      <li>
        <p>Leads - Set status Converted on leads profile, while client signed up with the same email</p>
      </li>
      <li>
        <p>Payments - Filter payment transactions by list of Original Agents</p>
      </li>
      <li>
        <p>Hierarchy - Ability to add an operator to Brand/Office/Desk/Team on it's creation</p>
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

    <hr/>

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

    <hr/>

    <h1>01/Jan/19 - Version 5</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Payments - Original Agent of transaction is being stored and displayed in transaction details</p>
      </li>
      <li>
        <p>Callbacks - Personal calendar is available at the header of Backoffice</p>
      </li>
      <li>
        <p>Universal sales and retention rules for all countries and languages</p>
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

    <hr/>

    <h1>25/Dec/18 - Version 4</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Payments - External Reference ID are displayed in transactions details</p>
      </li>
      <li>
        <p>Payments - Last 10 Deposits and Withdrawals on dashboard are displayed based on Hierarchy</p>
      </li>
      <li>
        <p>Leads - By default 20 last added Leads are displayed in leads grid</p>
      </li>
      <li>
        <p>Hierarchy visualization feature allows to see the hierarchy structure</p>
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

    <hr/>

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
        <p>By default operators see last 20 Clients and Payments in the corresponding grids</p>
      </li>
      <li>
        <p>Internal transfer validation has been improved</p>
      </li>
      <li>
        <p>Credit-in/out Feature - Operators can manually add or subtract credit on clients Trading account</p>
      </li>
      <li>
        <p>New payment flow with support of Naspay cashier has been implemented</p>
      </li>
      <li>
        <p>Payment transactions search has been improved</p>
      </li>
      <li>
        <p>Credit IN and OUT transactions are now available in transactions history of the client</p>
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

    <hr/>

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
        <p>You can filter clients by choosing Assigned or Unassigned to an agent</p>
      </li>
    </ul>

    <hr/>

    <h1>04/Dec/18 - Version 1</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Last 10 registrations, deposits, and withdrawals are displayed on Backoffice dashboard based on Hierarchy</p>
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

    <hr/>

    <h1>Release notes - Version Alpha MVP</h1>

    <h2>What has been done</h2>

    <ul>
      <li>
        <p>Bulk action on clients - now you can perform bulk actions on selected clients</p>
      </li>
      <li>
        <p>We have configured payments via Naspay</p>
      </li>
      <li>
        <p>Clients search allows one to search for clients by UUID, Email and Name</p>
      </li>
      <li>
        <p>Client portal has been created</p>
      </li>
      <li>
        <p>Create an MT4 Trading Account and update it's password right from the client's profile in Backoffice</p>
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
  </Fragment>
);

export default ReleaseNotes;
