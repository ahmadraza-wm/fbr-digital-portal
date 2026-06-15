
export default [
  {
    title: "Dashboard",
    to: { name: "dashboard" },
    icon: { icon: "tabler-layout-dashboard" },
  },

  // ── Admin Section ──────────────────────────────────────────────────────────
  {
    heading: "Administration",
  },
  {
    title: "Companies",
    icon: { icon: "tabler-building-skyscraper" },
    children: [
      { title: "All Companies", to: { name: "admin-companies" }, icon: { icon: "tabler-list" } },
      { title: "Add Company", to: { name: "admin-companies-create" }, icon: { icon: "tabler-plus" } },
    ],
  },
  {
    title: "Users",
    icon: { icon: "tabler-users" },
    children: [
      { title: "All Users", to: { name: "admin-users" }, icon: { icon: "tabler-list" } },
      { title: "Add User", to: { name: "admin-users-create" }, icon: { icon: "tabler-plus" } },
    ],
  },

  // ── Company Section ────────────────────────────────────────────────────────
  {
    heading: "Company",
  },
  {
    title: "Customers",
    icon: { icon: "tabler-users-group" },
    children: [
      { title: "All Customers", to: { name: "customers" }, icon: { icon: "tabler-list" } },
      { title: "Add Customer", to: { name: "customers-create" }, icon: { icon: "tabler-plus" } },
    ],
  },
  {
    title: "Products",
    icon: { icon: "tabler-package" },
    children: [
      { title: "All Products", to: { name: "products" }, icon: { icon: "tabler-list" } },
      { title: "Add Product", to: { name: "products-create" }, icon: { icon: "tabler-plus" } },
    ],
  },

  // ── FBR Digital Invoicing ──────────────────────────────────────────────────
  {
    heading: "FBR Digital Invoicing",
  },

  // FBR Digital Invoicing
  {
    title: "FBR Digital Invoicing",
    icon: { icon: "tabler-receipt-tax" },
    children: [
      {
        title: "DI Dashboard",
        to: { name: "fbr-dashboard" },
        icon: { icon: "tabler-home" },
      },
      {
        title: "Submit Invoice",
        to: { name: "fbr-submit" },
        icon: { icon: "tabler-send" },
      },
      {
        title: "Validate Invoice",
        to: { name: "fbr-validate" },
        icon: { icon: "tabler-shield-check" },
      },
      {
        title: "Reference Data",
        to: { name: "fbr-reference" },
        icon: { icon: "tabler-database" },
      },
      {
        title: "STATL Lookup",
        to: { name: "fbr-statl" },
        icon: { icon: "tabler-search" },
      },
      {
        title: "Invoice History",
        to: { name: "fbr-history" },
        icon: { icon: "tabler-history" },
      },
      {
        title: "API Settings",
        to: { name: "fbr-settings" },
        icon: { icon: "tabler-settings" },
      },
    ],
  },
];
