export const NAV_ITEMS = [
  { to: '/', label: 'Problems', exact: true },
  { to: '/playground', label: 'Playground', exact: false },
] as const

export type NavItem = (typeof NAV_ITEMS)[number]
