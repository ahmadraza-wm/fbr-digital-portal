import agentIcon from '@images/custom_icons/agent.svg'
import complaintsIcon from '@images/custom_icons/complaints.svg'
import complianceIcon from '@images/custom_icons/compliance.svg'
import countriesIcon from '@images/custom_icons/countries.svg'
import partnerIcon from '@images/custom_icons/partners.svg'
import ratesIcon from '@images/custom_icons/rates.svg'

export default [
  //Back Office
  {
    title: "Dashboard",
    to: { name: "dashboard" },
    icon: { icon: "tabler-layout-dashboard" },
  },
  {
    title: "Countries",
    to: { name: "countries" },
    icon: { icon: countriesIcon },
    permission: "countries.view"
  },
  {
    title: "Companies",
    icon: { icon: 'tabler-building-skyscraper' },
    children: [
      {
        title: "Create Company",
        to: "companies-add",
        permission: 'companies.create'
      },
      {
        title: "Companies List",
        to: "companies",
        permission: 'companies.list'
      },
    ],
  },
  {
    title: "Banks",
    icon: { icon: 'tabler-building-bank' },
    children: [
      {
        title: "Banks List",
        to: "banks",
        permission: 'banks.list'
      },
    ],
  },
  {
    title: "Wallets",
    icon: { icon: 'tabler-wallet' },
    children: [
      {
        title: "Wallets List",
        to: "wallets",
        permission: 'wallets.list'
      },
    ],
  },
  {
    title: "Cash Destinations",
    icon: { icon: 'tabler-cash' },
    children: [
      {
        title: "Destinations List",
        to: "cash-destinations",
        permission: 'wallets.list'
      },
    ],
  },
  // {
  //   title: "Customers",
  //   icon: { icon: "tabler-users-group" },
  //   children: [
  //     {
  //       title: "Customer List",
  //       to: "customers",
  //       permission: 'customers.list'
  //     },
  //     {
  //       title: "Beneficiaries",
  //       to: "beneficiaries",
  //       permission: 'beneficiaries.lists'
  //     },
  //     {
  //       title: "Customer Coupons",
  //       to: "customers-coupons-list",
  //       permission: 'customer.coupons.index'
  //     },
  //     // {
  //     //   title: "Customer Wallet Deposits",
  //     //   to: "customers-customer-wallet"
  //     // }
  //   ]
  // },
  // {
  //   title: "Rates",
  //   icon: { icon: ratesIcon },
  //   children: [
  //     // {
  //     //   title: "Partner Rate",
  //     //   to: "rates-partner-rate"
  //     // },
  //     {
  //       title: "Auto Rates",
  //       to: "rates-manage-rates",
  //       permission: 'manage.rates'
  //     },
  //     {
  //       title: "Source Rates",
  //       to: "rates-source-rate",
  //       permission: 'source.rates'
  //     },
  //     {
  //       title: "Rate Search",
  //       to: "rates-search-rates",
  //       permission: 'rate.index'
  //     },
  //     {
  //       title: "Admin Fee",
  //       to: "rates-admin-fee",
  //       permission: 'admin_fee.index'
  //     },
  //     {
  //       title: "Rules",
  //       to: "rates-rule-search",
  //       permission: 'rules.index'
  //     }
  //   ],
  // },
  // {
  //   title: "Countries",
  //   to: { name: "countries" },
  //   icon: { icon: countriesIcon },
  //   children: [
  //     {
  //       title: "Countries",
  //       to: "countries",
  //       permission: 'countries.list'
  //     },
  //     {
  //       title: "Configure Corridors",
  //       to: "countries-configure-corridors",
  //       permission: 'corridors.index'
  //     },
  //     {
  //       title: "Currencies",
  //       to: { name: "currencies" },
  //       permission: 'currencies.list'
  //     }

  //   ]
  // },
  // {
  //   title: "Payments",
  //   icon: { icon: "tabler-wallet" },
  //   children: [
  //     {
  //       title: "Incomplete payments",
  //       to: "payments-incomplete",
  //       permission: 'transactions.incomplete'
  //     },
  //     {
  //       title: "Pending payments",
  //       to: "payments-pending",
  //       permission: 'transactions.awaiting_funds'
  //     },
  //     {
  //       title: "Verifying payments",
  //       to: "payments-verifying",
  //       permission: 'transactions.verifying_transfer'
  //     },
  //     {
  //       title: "Compliance Hold",
  //       to: "payments-compliance",
  //       permission: 'transactions.compliance_held'
  //     },
  //     {
  //       title: "Processing Payment",
  //       to: "payments-processing",
  //       permission: 'transactions.processing_transfer'
  //     },
  //     {
  //       title: "Send to Partner",
  //       to: "payments-send-partner",
  //       permission: 'transactions.send_to_partner'
  //     },
  //     {
  //       title: "Available For Collection",
  //       to: "payments-available-for-collection",
  //       permission: 'transactions.available_for_collection'
  //     },
  //     {
  //       title: "Canceling Payments",
  //       to: "payments-canceling",
  //       permission: 'transactions.canceling'
  //     },
  //     {
  //       title: "Track All Payments",
  //       to: "payments-search",
  //       permission: 'transactions.track_all'
  //     },
  //     {
  //       title: "Partner Status",
  //       to: "payments-partner-status",
  //       permission: 'payments.partner.status'
  //     },
  //   ]
  // },
  // {
  //   title: "Modification",
  //   icon: { icon: "tabler-settings-plus" },
  //   children: [

  //     {
  //       title: "Change Beneficiary Detail",
  //       to: "modification-beneficiary-edit",
  //       permission: "modification.change.beneficiary.details"
  //     },
  //     {
  //       title: "Payment Cancelling Request",
  //       to: "modification-payment-canceling",
  //       permission: 'modification.payment.canceling'
  //     },
  //     {
  //       title: "Mark as Paid",
  //       to: "modification-payment-mark-paid",
  //       permission: 'modification.mark.as.paid'
  //     },
  //     {
  //       title: "Change Payment Status",
  //       to: "modification-payment-change-status",
  //       permission: 'modification.change.payment.status'
  //     },
  //     // {
  //     //   title: "Update Partner Details",
  //     //   to: "modification-payment-update-partner"
  //     // },
  //     {
  //       title: "Release Partner Payments",
  //       to: "modification-payment-release-payment",
  //       permission: 'release.partner.payments'
  //     },
  //     {
  //       title: "Change Pin Number",
  //       to: "modification-payment-change-pin-number",
  //       permission: 'change.pin'
  //     },
  //     {
  //       title: "Replace Pin Number",
  //       to: "modification-payment-replace-pin-number",
  //       permission: 'replace.pin.number'
  //     },
  //   ]
  // },
  // {
  //   title: "Complaints",
  //   icon: { icon: complaintsIcon },
  //   children: [

  //     {
  //       title: "Complaints",
  //       to: "complaints",
  //       permission: 'complaints.index'
  //     },
  //     {
  //       title: "Suggestions",
  //       to: "suggestions",
  //       permission: 'suggesstions.index'
  //     },
  //   ]
  // },
  // {
  //   title: "Compliance",
  //   icon: { icon: complianceIcon },
  //   children: [
  //     {
  //       title: "Sanction List",
  //       to: "compliance-sanction-list",
  //       permission: 'compliance.sanction.list'
  //     },
  //     {
  //       title: "Threshold",
  //       to: "compliance-threshold",
  //       permission: 'thresholds.index'
  //     },
  //     // {
  //     //   title: "SAR List",
  //     //   to: "compliance-sar-list"
  //     // },
  //     {
  //       title: "Remarks",
  //       to: "compliance-remarks",
  //       permission: 'remarks.index'
  //     },
  //   ]
  // },
  // {
  //   title: "Partners",
  //   icon: { icon: partnerIcon },
  //   children: [
  //     {
  //       title: "Create Partner",
  //       to: "partners-create-partner",
  //       permission: 'partners.store'
  //     },
  //     {
  //       title: "Partner List",
  //       to: "partners",
  //       permission: 'partners.index'
  //     },
  //     {
  //       title: "Partner Ledger",
  //       to: "partners-partner-ledger",
  //       permission: 'partner.ledger'
  //     },
  //     {
  //       title: "Partner Rate",
  //       to: "payments-partner-rate",
  //       permission: 'partner.rates'
  //     },
  //     {
  //       title: "Posting in PL",
  //       to: "partners-add-ledger",
  //       permission: 'partner.ledger.manual.entry'
  //     },
  //     // {
  //     //   title: "Partner Commission",
  //     //   to: "partners-commission-list",
  //     //   permission: 'remarks.index'
  //     // },
  //     {
  //       title: "Create Payer",
  //       to: "payers-create-payer",
  //       permission: 'payers.create'
  //     },
  //     {
  //       title: "Payer List",
  //       to: "payers",
  //       permission: 'payers.index'
  //     },
  //     {
  //       title: "Banks",
  //       to: "banks",
  //       permission: 'banks.index'
  //     },
  //     {
  //       title: "Wallets",
  //       to: "wallets",
  //       permission: 'wallets.index'
  //     },
  //     {
  //       title: "Cash Destination",
  //       to: "cash-destination",
  //       permission: 'destinations.search'
  //     },
  //     {
  //       title: "Gateways",
  //       to: "gateways",
  //       permission: 'gateways.index'
  //     },

  //   ],
  // },
  // {
  //   title: "Reports",
  //   to: { name: "reports" },
  //   icon: { icon: "tabler-report" },
  //   permission: "reports"
  // },
  // {
  //   title: "Exports",
  //   to: { name: "exports" },
  //   icon: { icon: "tabler-file-export" },
  //   permission: "exports"
  // },
  // {
  //   title: "Promotions",
  //   icon: { icon: "tabler-speakerphone" },
  //   children: [
  //     {
  //       title: "Tickers",
  //       to: "promotions-tickers",
  //       permission: "tickers.index"
  //     },
  //     {
  //       title: "Online Promotions",
  //       to: "promotions-online-promotions",
  //       permission: "promotions.index"
  //     },
  //     {
  //       title: "Fee Free Transfers",
  //       to: "promotions-free-fee-transfer",
  //       permission: "fee_free_transfers.index"
  //     },
  //     {
  //       title: "Customer Rates",
  //       to: "promotions-customer-rate",
  //       permission: "customerRates.index"
  //     },
  //     {
  //       title: "Referral Codes",
  //       to: "promotions-refrel-code",
  //       permission: "referral.index"
  //     },
  //     {
  //       title: "Manage Notifications",
  //       to: "promotions-push-notifications",
  //       permission: "push.notifications"
  //     },
  //     {
  //       title: "Send Push Notifications",
  //       to: "promotions-send-push-notification",
  //       permission: "send.notification"
  //     }
  //   ]
  // },
  // {
  //   title: "Users",
  //   to: { name: "users-list" },
  //   icon: { icon: "tabler-users" },
  //   permission: "backofficeuser.index"
  // },
  //  {
  //   title: "Mobile app settings",
  //   icon: { icon: "tabler-device-mobile" },
  //   children: [
  //     {
  //       title: "Banners",
  //       to: "settings-app-setting-banner",
  //       permission:"banners.list"
  //     },
  //   ]
  // },
  // // Agent Portal
  // {
  //   title: "Send Money",
  //   to: { name: "agent-send-money" },
  //   icon: { icon: "tabler-wallet" },
  //   permission:"agent.send.money.details"
  // },
  // {
  //   title: "Transactions",
  //   to: { name: "agent-transactions" },
  //   icon: { icon: "tabler-wallet" },
  //   permission:"agent.transactions.index"
  // },
  // {
  //   title: "Search Customers",
  //   to: { name: "agent-customers" },
  //   icon: { icon: "tabler-users-group" },
  //   permission:"agent.customers.list"
  // },
  //  {
  //   title: "Exchange Rates",
  //   to: { name: "agent-rates" },
  //   icon: { icon: ratesIcon},
  //   permission:"agent.source.rates"
  // },
  // {
  //   title: "Deposits",
  //   to: { name: "agent-deposits" },
  //   icon: { icon: 'tabler-report'},
  //   permission:"agent.deposits.index"
  // },
  // {
  //   title: "Ledger",
  //   to: { name: "agent-ledger" },
  //   icon: { icon: 'tabler-report'},
  //   permission:"agent.portal.agent.ledger"
  // },
  // // {
  // //   title: "Cashiers",
  // //   to: { name: "agent-cashiers" },
  // //   icon: { icon: ratesIcon},
  // //   permission:"agent.transactions.index"
  // // },
  // {
  //   title: "Customer Ledger",
  //   to: { name: "agent-customers-ledger" },
  //   icon: { icon: 'tabler-report'},
  //   permission:"agent.customer.ledger.details"
  // },
  // {
  //   title: "Settings",
  //   to: { name: "agent-settings" },
  //   icon: { icon: 'tabler-settings-cog'},
  //   permission:"agent.transactions.index"
  // },
];
