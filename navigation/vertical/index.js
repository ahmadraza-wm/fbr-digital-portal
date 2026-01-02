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
    title: "Currencies",
    to: { name: "currencies" },
    icon: { icon: 'tabler-currency' },
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
    title: "Partners",
    icon: { icon: partnerIcon },
    children: [
      {
        title: "Create Partner",
        to: "partners-add",
        permission: 'partners.create'
      },
      {
        title: "Partner List",
        to: "partners",
        permission: 'partners.list'
      },
    ]
  },
  {
    title: "Banks",
    icon: { icon: 'tabler-building-bank' },
    children: [
      {
        title: "Create Bank",
        to: "banks-add",
        permission: 'banks.create'
      },
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
        title: "Create Wallet",
        to: "wallets-add",
        permission: 'wallets.create'
      },
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
        title: "Create Destination",
        to: "cash-destinations-add",
        permission: 'cash_destinations.create'
      },
      {
        title: "Destinations List",
        to: "cash-destinations",
        permission: 'wallets.list'
      },
    ],
  },
];
