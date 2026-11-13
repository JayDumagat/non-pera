import { useEffect, useMemo, useState } from 'react'
import { Navigate, NavLink as RouterNavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpDown,
  ArrowUpRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock,
  ExternalLink,
  FileText,
  Filter,
  Home,
  LayoutGrid,
  LockKeyhole,
  LogOut,
  Medal,
  Menu,
  MessageCircle,
  Moon,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Send,
  Sparkles,
  Sun,
  TrendingUp,
  UserRound,
  Users,
  WalletCards,
  X,
} from 'lucide-react'

const navigationSections = [
  { label: 'Overview', items: [{ id: 'home', label: 'Home', icon: 'home' }] },
  { label: 'Invest', items: [
    { id: 'portfolio', label: 'Portfolio', icon: 'portfolio' },
    {
      id: 'products',
      label: 'Products',
      icon: 'products',
      badge: {
        text: 'New',
        icon: 'sparkles',
        title: 'New products available on the Products page',
      },
    },
    { id: 'funding', label: 'Funding', icon: 'funding' },
  ] },
  { label: 'Discover', items: [{ id: 'learn', label: 'Learn', icon: 'learn', badge: '2' }] },
  { label: 'Account', items: [
    { id: 'messages', label: 'Messages', icon: 'messages', unread: true },
    { id: 'profile', label: 'Profile', icon: 'profile' },
  ] },
]

const traderNavigationSections = [
  { label: 'Agent Desk', items: [{ id: 'clients', label: 'Clients', icon: 'users', badge: '5' }] },
]

const navigation = navigationSections.flatMap((section) => section.items)

const sidebarUtilityLinks = [
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'faq', label: 'FAQ', icon: 'faq' },
  { id: 'terms-of-service', label: 'Terms of Service', icon: 'terms' },
  { id: 'privacy-policy', label: 'Privacy Policy', icon: 'privacy' },
  { id: 'sign-out', label: 'Sign Out', icon: 'signout', danger: true },
]

const pesoFormatter = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2, maximumFractionDigits: 2 })

function formatPeso(amount) {
  return pesoFormatter.format(amount)
}

const holdings = [
  { ticker: 'VTI', name: 'Total Market ETF', type: 'US equities', units: '42.8 shares', value: 9422.16, change: 4.28, color: '#3b82f6' },
  { ticker: 'VXUS', name: 'International ETF', type: 'Global equities', units: '68.2 shares', value: 6218.4, change: 2.14, color: '#707c9a' },
  { ticker: 'BND', name: 'Total Bond ETF', type: 'Fixed income', units: '51.6 shares', value: 4310.64, change: 0.86, color: '#b4bac7' },
  { ticker: 'AAPL', name: 'Apple Inc.', type: 'Technology', units: '8.5 shares', value: 1468.8, change: -1.22, color: '#d6a565' },
]

const products = [
  { id: 'market', symbol: '◎', name: 'Total Market Index', category: 'Index funds', detail: 'Broad exposure to leading US companies', minimum: '₱1', fee: '0.03%', risk: 'Moderate', tint: 'sage', return: '+8.4%' },
  { id: 'global', symbol: '◉', name: 'Global Equity Fund', category: 'Index funds', detail: 'Invest across established global markets', minimum: '₱1', fee: '0.08%', risk: 'Moderate', tint: 'blue', return: '+7.1%' },
  { id: 'tech', symbol: '✦', name: 'NextGen AI & Tech Index', category: 'Index funds', detail: 'High-growth technology leaders shaping AI and automation', minimum: '₱50', fee: '0.14%', risk: 'Growth', tint: 'blue', return: '+14.6%', isNew: true },
  { id: 'treasury', symbol: '▤', name: 'Treasury Portfolio', category: 'Fixed income', detail: 'A steadier mix of government bonds', minimum: '₱100', fee: '0.12%', risk: 'Low', tint: 'sand', return: '+4.2%' },
  { id: 'cash', symbol: '◌', name: 'Cash Reserve', category: 'Cash', detail: 'Keep funds available for your next move', minimum: '₱1', fee: 'No fee', risk: 'Low', tint: 'lavender', return: '4.1% APY' },
  { id: 'retirement', symbol: '↗', name: 'Future Builder', category: 'Retirement', detail: 'A diversified long-term portfolio', minimum: '₱25', fee: '0.18%', risk: 'Balanced', tint: 'rose', return: '+6.8%' },
  { id: 'green', symbol: '✳', name: 'Sustainable Leaders', category: 'Index funds', detail: 'Companies screened for sustainability', minimum: '₱10', fee: '0.15%', risk: 'Moderate', tint: 'sage', return: '+6.2%', isNew: true },
]

const activities = [
  { title: 'Recurring investment', detail: 'Total Market ETF · Today, 9:42 AM', amount: '-₱150.00', kind: 'invest' },
  { title: 'Dividend received', detail: 'International ETF · Oct 12, 2026', amount: '+₱18.24', kind: 'income' },
  { title: 'Deposit completed', detail: 'Bank transfer · Oct 10, 2026', amount: '+₱500.00', kind: 'deposit' },
]

const rangeReturns = { '1W': '+1.24%', '1M': '+5.49%', '3M': '+8.16%', '1Y': '+12.38%', ALL: '+18.62%' }

const portfolioCategories = [
  { id: 'overall', label: 'Overall', value: 24680.5, change: '+5.49%', changeAmount: 1284.2, color: '#6366f1' },
  { id: 'equities', label: 'Equities', value: 17240, change: '+6.21%', changeAmount: 1008.4, color: '#2563eb' },
  { id: 'uitfs', label: 'UITFs', value: 3480.5, change: '+3.71%', changeAmount: 124.5, color: '#0d9488' },
  { id: 'mutual-fund', label: 'Mutual fund', value: 2760, change: '+4.52%', changeAmount: 119.3, color: '#d97706' },
  { id: 'others', label: 'Others', value: 1200, change: '+2.74%', changeAmount: 32, color: '#7c3aed' },
]

const categoryChartPoints = {
  overall: [180, 172, 176, 151, 157, 133, 140, 115, 121, 96, 103, 75, 62],
  equities: [184, 178, 163, 168, 143, 149, 120, 116, 95, 88, 62, 46, 29],
  uitfs: [175, 168, 171, 157, 162, 143, 146, 129, 132, 113, 105, 93, 80],
  'mutual-fund': [182, 177, 171, 174, 161, 157, 150, 153, 137, 140, 123, 109, 95],
  others: [176, 171, 178, 163, 166, 152, 145, 149, 134, 128, 115, 107, 98],
}

const rangePointCounts = { '1W': 5, '1M': 7, '3M': 9, '1Y': 11, ALL: 13 }
const rangeReturnMultipliers = { '1W': 0.22, '1M': 1, '3M': 2.6, '1Y': 6, ALL: 10 }

const investmentAccounts = [
  { id: 'account-1', category: 'equities', name: 'Margin', accountNumber: 'JOHALEM-101-1-01-001', value: 9422.16, monthlyReturn: 5.2, color: '#2563eb' },
  { id: 'account-2', category: 'equities', name: 'Discretionary', accountNumber: 'JOHALEM-102-2-01-002', value: 6218.4, monthlyReturn: 4.4, color: '#3b82f6' },
  { id: 'account-3', category: 'equities', name: 'Broker-Assisted', accountNumber: 'JOHALEM-103-1-02-003', value: 1599.44, monthlyReturn: 7.6, color: '#60a5fa' },
  { id: 'account-4', category: 'uitfs', name: 'BDO Equity Index Fund', accountNumber: 'JOHALEM-201-1-01-004', value: 2180.5, monthlyReturn: 3.8, color: '#0d9488' },
  { id: 'account-5', category: 'uitfs', name: 'BPI Short Term Fund', accountNumber: 'JOHALEM-202-2-01-005', value: 1300, monthlyReturn: 2.4, color: '#14b8a6' },
  { id: 'account-6', category: 'mutual-fund', name: 'ALFM Growth Fund', accountNumber: 'JOHALEM-301-1-01-006', value: 1680, monthlyReturn: 4.1, color: '#d97706' },
  { id: 'account-7', category: 'mutual-fund', name: 'Philequity Fund', accountNumber: 'JOHALEM-302-2-02-007', value: 1080, monthlyReturn: 5.6, color: '#f59e0b' },
  { id: 'account-8', category: 'others', name: 'Margin Fixed Income', accountNumber: 'JOHALEM-401-1-01-008', value: 900, monthlyReturn: 1.1, color: '#7c3aed' },
  { id: 'account-9', category: 'others', name: 'Discretionary Trust', accountNumber: 'JOHALEM-402-2-01-009', value: 300, monthlyReturn: 2.2, color: '#8b5cf6' },
]

const categoryBenchmarks = {
  overall: { name: 'Philippine market blend', monthlyReturn: 3.4, color: '#818a9b' },
  equities: { name: 'PSEi index', monthlyReturn: 4.2, color: '#818a9b' },
  uitfs: { name: 'UITF market benchmark', monthlyReturn: 2.8, color: '#818a9b' },
  'mutual-fund': { name: 'Mutual fund benchmark', monthlyReturn: 3.3, color: '#818a9b' },
  others: { name: 'Fixed income benchmark', monthlyReturn: 1.6, color: '#818a9b' },
}

const categoryPeraBalances = {
  overall: { value: 18450, change: '+3.85%', changeAmount: 684.2 },
  equities: { value: 13100, change: '+4.10%', changeAmount: 516.4 },
  uitfs: { value: 2450, change: '+3.20%', changeAmount: 76.1 },
  'mutual-fund': { value: 1900, change: '+3.80%', changeAmount: 69.7 },
  others: { value: 1000, change: '+2.20%', changeAmount: 22.0 },
}

const categoryCashBalances = {
  overall: { nonPera: 3260.5, pera: 1850 },
  equities: { nonPera: 2150, pera: 1200 },
  uitfs: { nonPera: 520.5, pera: 350 },
  'mutual-fund': { nonPera: 390, pera: 200 },
  others: { nonPera: 200, pera: 100 },
}

function formatReturn(value) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

function getCategoryAccounts(category, accountsList = investmentAccounts) {
  return category === 'overall' ? accountsList : accountsList.filter((account) => account.category === category)
}

function getCategoryChartSeries(category, selectedAccountId = null, accountsList = investmentAccounts, categoriesList = portfolioCategories) {
  const selectedAccount = accountsList.find((account) => account.id === selectedAccountId)
  const chartCategory = selectedAccount?.category || category
  const benchmark = categoryBenchmarks[chartCategory] || categoryBenchmarks.overall
  const accounts = chartCategory === 'overall' ? [] : getCategoryAccounts(chartCategory, accountsList)
  const overallCategory = categoriesList[0] || portfolioCategories[0]
  const portfolioSeries = selectedAccount
    ? [{ id: selectedAccount.id, name: selectedAccount.name, monthlyReturn: selectedAccount.monthlyReturn, color: selectedAccount.color }]
    : chartCategory === 'overall'
      ? [{ id: 'portfolio', name: 'Total portfolio', monthlyReturn: Number(overallCategory.change.replace('%', '').replace('+', '')), color: '#2563eb' }]
      : accounts.map((account) => ({ id: account.id, name: account.name, monthlyReturn: account.monthlyReturn, color: account.color }))

  return [...portfolioSeries, { id: 'benchmark', name: benchmark.name, monthlyReturn: benchmark.monthlyReturn, color: benchmark.color, benchmark: true }]
}

function getCategoryPerformanceData(category, range, selectedAccountId = null, accountsList = investmentAccounts, categoriesList = portfolioCategories) {
  const selectedAccount = accountsList.find((account) => account.id === selectedAccountId)
  const chartCategory = selectedAccount?.category || category
  const activeCategory = categoriesList.find((item) => item.id === chartCategory) || categoriesList[0]
  const series = getCategoryChartSeries(activeCategory.id, selectedAccountId, accountsList, categoriesList)
  const trendData = getTrendData(activeCategory.id, range, categoriesList)
  const points = categoryChartPoints[activeCategory.id].slice(-rangePointCounts[range])
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  const multiplier = rangeReturnMultipliers[range]

  return points.map((point, index) => {
    const progress = firstPoint === lastPoint ? 1 : (firstPoint - point) / (firstPoint - lastPoint)
    const row = { date: trendData[index].date }
    series.forEach((item, seriesIndex) => {
      const curveVariation = Math.sin(Math.PI * progress) * Math.sin(progress * 4.2 + seriesIndex * 1.15) * 0.12
      const returnValue = item.monthlyReturn * multiplier * Math.max(0, progress + curveVariation)
      row[item.id] = Number(returnValue.toFixed(2))
    })
    return row
  })
}

function getTrendData(category, range, categoriesList = portfolioCategories) {
  const activeCategory = categoriesList.find((item) => item.id === category) || categoriesList[0]
  const currentValue = activeCategory.value
  const points = categoryChartPoints[activeCategory.id].slice(-rangePointCounts[range])
  const firstPoint = points[0]
  const lastPoint = points[points.length - 1]
  const periodReturn = Number(rangeReturns[range].replace('%', '').replace('+', '')) / 100
  const startValue = currentValue / (1 + periodReturn)
  const daySpans = { '1W': 7, '1M': 30, '3M': 90, '1Y': 365, ALL: 1460 }
  const span = daySpans[range]
  const today = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', range === '1Y' ? { month: 'short' } : range === 'ALL' ? { year: 'numeric' } : { month: 'short', day: 'numeric' })

  return points.map((point, index) => {
    const progress = firstPoint === lastPoint ? 1 : (firstPoint - point) / (firstPoint - lastPoint)
    const date = new Date(today.getTime() - span * 86400000 * (1 - index / (points.length - 1)))
    return {
      date: formatter.format(date),
      value: Number((startValue + (currentValue - startValue) * progress).toFixed(2)),
    }
  })
}

const iconComponents = {
  home: Home,
  portfolio: BriefcaseBusiness,
  products: LayoutGrid,
  funding: WalletCards,
  learn: BookOpen,
  messages: MessageCircle,
  profile: UserRound,
  search: Search,
  bell: Bell,
  arrow: ArrowRight,
  up: TrendingUp,
  down: ChevronDown,
  plus: Plus,
  check: Check,
  clock: Clock,
  external: ExternalLink,
  menu: Menu,
  lock: LockKeyhole,
  send: Send,
  sun: Sun,
  moon: Moon,
  medal: Medal,
  sparkles: Sparkles,
  collapse: ChevronLeft,
  expand: ChevronRight,
  settings: Settings,
  faq: CircleHelp,
  terms: FileText,
  privacy: ShieldCheck,
  signout: LogOut,
  users: Users,
  orders: ArrowUpDown,
  filter: Filter,
}

function Icon({ name, size = 20, className = '' }) {
  const LucideIcon = iconComponents[name] || CircleHelp
  return <LucideIcon aria-hidden="true" className={className} size={size} strokeWidth={1.7} />
}

function Avatar({ className = 'size-10', iconSize = 20 }) {
  return <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-xl bg-[#e9d9ca] text-[#6b6f77] ${className}`}><UserRound size={iconSize} strokeWidth={1.7} /></span>
}

function Brand({ compact = false }) {
  return (
    <div className={`flex h-10 items-center ${compact ? 'w-10 justify-center' : 'w-full'}`}>
      <img
        src={compact ? '/cgsi-logo-mark.png' : '/cgsi-logo-full.png'}
        alt="Caballes-Go Securities logo"
        className={compact ? 'h-10 w-10 shrink-0 object-contain' : 'h-10 w-full object-contain object-left'}
      />
    </div>
  )
}

function SidebarLink({ item, mobile = false, collapsed = false }) {
  const compact = collapsed && !mobile
  const isAnnouncement = typeof item.badge === 'object' && item.badge !== null
  const compactTitle = compact
    ? isAnnouncement
      ? `${item.label} · ${item.badge.title || `${item.badge.text} products available`}`
      : item.label
    : undefined

  return (
    <RouterNavLink
      to={`/${item.id}`}
      end
      aria-label={compact ? item.label : undefined}
      title={compactTitle}
      className={({ isActive }) => `group relative flex items-center rounded-xl py-2.5 text-left text-[14px] font-medium transition ${mobile ? 'shrink-0 gap-3 px-3' : compact ? 'w-full justify-center px-0' : 'w-full gap-3 px-3'} ${item.danger ? 'text-[#b86a62] hover:bg-[#fff2f0] hover:text-[#a94f48]' : isActive ? 'bg-[#eff6ff] text-[#1d4ed8]' : 'text-[#757982] hover:bg-[#f3f4f6] hover:text-[#2563eb]'}`}
    >
      {({ isActive }) => <>
        <div className="relative flex shrink-0 items-center justify-center">
          <Icon name={item.icon} size={19} className={item.danger ? 'text-[#b86a62]' : isActive ? 'text-[#2563eb]' : 'text-[#9397a0] group-hover:text-[#2563eb]'} />
          {compact && isAnnouncement && (
            <span
              title={item.badge.title || `${item.badge.text} products available`}
              className="sidebar-badge-ring absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-gradient-to-tr from-[#2563eb] to-[#4f46e5] text-white shadow-xs ring-2 transition-transform duration-200 group-hover:scale-110"
            >
              <Sparkles size={9} className="text-amber-300 fill-amber-300 animate-sparkle" />
            </span>
          )}
          {compact && !isAnnouncement && item.badge && (
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#f3e8d9] text-[8px] font-bold text-[#a87543]">
              {item.badge}
            </span>
          )}
          {compact && item.unread && (
            <span className="absolute right-1 top-1 size-2 rounded-full bg-[#cc8a52]" />
          )}
        </div>
        {!compact && <span>{item.label}</span>}
        {!compact && item.badge && (
          isAnnouncement ? (
            <span
              title={item.badge.title || `${item.badge.text} products available`}
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#4f46e5] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs shadow-blue-500/25 ring-1 ring-white/20 transition-all duration-200 group-hover:scale-105 group-hover:shadow-blue-500/40"
            >
              <Sparkles size={10} className="shrink-0 text-amber-300 fill-amber-300/80 animate-sparkle" />
              <span className="leading-none">{item.badge.text}</span>
            </span>
          ) : (
            <span className="ml-auto rounded-full bg-[#f3e8d9] px-1.5 py-0.5 text-[9px] font-bold text-[#a87543]">
              {item.badge}
            </span>
          )
        )}
        {!compact && item.unread && (
          <span className="ml-auto size-2 rounded-full bg-[#cc8a52]" />
        )}
      </>}
    </RouterNavLink>
  )
}

function Sidebar({ collapsed, onToggle, isTraderView }) {
  const sections = isTraderView ? traderNavigationSections : navigationSections
  return (
    <aside className={`relative z-30 hidden shrink-0 flex-col border-r border-[#e8e9ec] bg-white py-7 transition-[width,padding] duration-200 lg:flex ${collapsed ? 'w-[76px] px-2' : 'w-[248px] px-5'}`}>
      <div className={`mb-6 px-1 ${collapsed ? 'flex justify-center' : 'flex'}`}>
        <Brand compact={collapsed} />
      </div>

      <button
        type="button"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!collapsed}
        aria-controls="primary-navigation"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={onToggle}
        className="absolute -right-[18px] top-7 z-40 flex size-9 items-center justify-center rounded-full border border-[#c4cad4] bg-white text-[#525866] shadow-md transition hover:border-[#2563eb] hover:bg-[#f8f9fa] hover:text-[#2563eb] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]"
      >
        <Icon name={collapsed ? 'expand' : 'collapse'} size={17} />
      </button>
      <div className="scroll-pane flex min-h-0 flex-1 flex-col overflow-y-auto">
        <nav id="primary-navigation" className={`flex flex-col ${collapsed ? 'gap-4' : 'gap-6'}`} aria-label="Main navigation">
          {sections.map((section) => <div key={section.label} className={collapsed ? 'border-t border-[#edeef0] pt-3 first:border-0 first:pt-0' : ''}>
            {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a1a4aa]">{section.label}</p>}
            <div className="flex flex-col gap-1">{section.items.map((item) => <SidebarLink key={item.id} item={item} collapsed={collapsed} />)}</div>
          </div>)}
        </nav>
        <div className="mt-auto pt-6">
          <nav aria-label="Settings and help" className={`flex flex-col gap-1 border-t border-[#edeef0] pt-3 ${collapsed ? 'items-center' : ''}`}>
            {sidebarUtilityLinks.map((item) => <SidebarLink key={item.id} item={item} collapsed={collapsed} />)}
          </nav>
        </div>
      </div>
    </aside>
  )
}

function Header({ darkMode, setDarkMode, isTraderView }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="relative z-20 flex items-center justify-between gap-3 border-b border-[#e8e9ec] bg-white px-4 py-3 sm:px-8 lg:px-10 lg:py-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {!isTraderView && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#333948] sm:text-base">{`${greeting}, Alex`}</p>
            <p className="hidden text-[10px] text-[#8e94a0] sm:block">Balanced risk profile · Personal Portfolio</p>
          </div>
        )}

        {/* View Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            aria-label="Switch between Investor View and Trader/Agent View"
            aria-expanded={roleMenuOpen}
            onClick={() => {
              setRoleMenuOpen(!roleMenuOpen)
              setNotificationsOpen(false)
              setUserOpen(false)
            }}
            className="flex items-center gap-1.5 rounded-xl border border-[#d2d6df] bg-[#f8f9fa] px-2.5 py-1.5 text-xs font-semibold text-[#343b49] shadow-2xs transition hover:border-[#2563eb] hover:bg-white sm:gap-2 sm:px-3 sm:py-2"
          >
            <span className={`size-2 shrink-0 rounded-full ${isTraderView ? 'bg-[#0f9f83]' : 'bg-[#2563eb]'}`} />
            <span className="truncate max-w-[100px] sm:max-w-none text-[11px] sm:text-xs">
              {isTraderView ? 'Trader / Agent View' : 'Investor View'}
            </span>
            <ChevronDown size={13} className="text-[#848c9b]" />
          </button>

          {roleMenuOpen && (
            <div
              className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-[#e4e7ed] bg-white p-2 shadow-xl z-50"
              role="menu"
              aria-label="Select view mode"
            >
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#9aa0ac]">Switch Portal View</p>
              <button
                type="button"
                onClick={() => {
                  setRoleMenuOpen(false)
                  navigate('/home')
                }}
                className={`flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition ${!isTraderView ? 'bg-[#eff5ff] text-[#1d4ed8]' : 'text-[#424855] hover:bg-[#f6f7f9]'}`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/10 text-[#2563eb]">
                  <UserRound size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Investor View</span>
                    {!isTraderView && <Check size={14} className="text-[#2563eb]" />}
                  </div>
                  <span className="mt-0.5 block text-[10px] text-[#868d99]">Personal portfolio, PERA &amp; cash</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRoleMenuOpen(false)
                  navigate('/clients')
                }}
                className={`mt-1 flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition ${isTraderView ? 'bg-[#ecfdf5] text-[#065f46]' : 'text-[#424855] hover:bg-[#f6f7f9]'}`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#0f9f83]/10 text-[#0f9f83]">
                  <BriefcaseBusiness size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Trader / Agent View</span>
                    {isTraderView && <Check size={14} className="text-[#059669]" />}
                  </div>
                  <span className="mt-0.5 block text-[10px] text-[#868d99]">Clients, advisory chat &amp; orders blotter</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button type="button" aria-label={darkMode ? 'Switch to day mode' : 'Switch to night mode'} aria-pressed={darkMode} onClick={() => setDarkMode(!darkMode)} className="flex size-9 items-center justify-center rounded-xl text-[#717580] transition hover:bg-[#f2f3f5] hover:text-[#2563eb] sm:size-10">
          <Icon name={darkMode ? 'sun' : 'moon'} size={19} />
        </button>
        <div className="relative">
          <button type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen(!notificationsOpen); setUserOpen(false); setRoleMenuOpen(false) }} className="relative flex size-9 items-center justify-center rounded-xl text-[#717580] transition hover:bg-[#f2f3f5] hover:text-[#2563eb] sm:size-10">
            <Icon name="bell" size={19} /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-[#cb8750]" />
          </button>
          {notificationsOpen && <div className="absolute right-0 top-full mt-3 w-[290px] overflow-hidden rounded-2xl border border-[#e7e9ec] bg-white shadow-xl sm:w-[330px]" role="menu" aria-label="Notifications">
            <div className="flex items-center justify-between border-b border-[#edeef0] px-4 py-3"><div><p className="text-sm font-semibold text-[#3d4351]">Notifications</p><p className="mt-0.5 text-[10px] text-[#999da4]">You have 2 new updates</p></div><span className="rounded-full bg-[#f5ebdf] px-2 py-1 text-[9px] font-bold text-[#a87543]">2 new</span></div>
            <button type="button" onClick={() => { navigate(isTraderView ? '/clients' : '/learn'); setNotificationsOpen(false) }} className="flex w-full gap-3 border-b border-[#f0f1f2] p-4 text-left hover:bg-[#f8f9fa]"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#edf0f4] text-[#5f6d8a]"><Icon name={isTraderView ? 'users' : 'learn'} size={17} /></span><span><span className="block text-xs font-semibold text-[#464c59]">{isTraderView ? 'Client Order Queued' : 'New in Learn'}</span><span className="mt-1 block text-[10px] leading-4 text-[#92969e]">{isTraderView ? 'Sofia Romero queued a buy order on SMPH.' : 'Two new guides are ready for you.'}</span><span className="mt-1 block text-[9px] text-[#a1a4aa]">Today</span></span></button>
            <button type="button" onClick={() => { navigate(isTraderView ? '/clients' : '/portfolio'); setNotificationsOpen(false) }} className="flex w-full gap-3 p-4 text-left hover:bg-[#f8f9fa]"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f5f1e9] text-[#aa8354]"><Icon name="portfolio" size={17} /></span><span><span className="block text-xs font-semibold text-[#464c59]">{isTraderView ? 'Desk Execution Complete' : 'Your weekly summary'}</span><span className="mt-1 block text-[10px] leading-4 text-[#92969e]">{isTraderView ? 'BDO order executed for Marcus Tan.' : 'Your portfolio is up 1.2% this week.'}</span><span className="mt-1 block text-[9px] text-[#a1a4aa]">Yesterday</span></span></button>
          </div>}
        </div>
        <span aria-hidden="true" className="mx-2 h-7 w-px bg-[#e2e4e8] sm:mx-3" />
        <div className="relative">
          <button type="button" aria-label="Open user menu" aria-expanded={userOpen} onClick={() => { setUserOpen(!userOpen); setNotificationsOpen(false); setRoleMenuOpen(false) }} className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-[#f5f6f7] sm:gap-3 sm:pr-2">
            <span className="hidden min-w-0 text-left sm:block"><span className="block max-w-32 truncate text-xs font-semibold text-[#404653]">Alex Johnson</span><span className="mt-1 block text-[10px] text-[#8f939b]">{isTraderView ? 'Broker #CRN-84920' : 'Balanced risk profile'}</span></span>
            <Avatar className="size-9 sm:size-10" iconSize={19} />
          </button>
          {userOpen && <div className="absolute right-0 top-full mt-3 w-[260px] rounded-2xl border border-[#e7e9ec] bg-white p-2 shadow-xl" role="menu" aria-label="User menu">
            <div className="flex items-center justify-between gap-3 border-b border-[#edeef0] px-3 py-3"><span><span className="block text-xs font-semibold text-[#404653]">Alex Johnson</span><span className="mt-1 block text-[10px] text-[#4f596c]">{isTraderView ? 'Licensed Broker · Institutional' : 'Balanced risk profile'}</span><span className="mt-1 block text-[10px] text-[#8f939b]">alex.johnson@example.com</span></span><Avatar className="size-10" /></div>
            <button type="button" onClick={() => { navigate(isTraderView ? '/home' : '/clients'); setUserOpen(false) }} className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[#2563eb] hover:bg-[#eff5ff] flex items-center justify-between">
              <span>{isTraderView ? 'Switch to Investor View' : 'Switch to Trader View'}</span>
              <ArrowRight size={13} />
            </button>
            <button type="button" onClick={() => { navigate('/profile'); setUserOpen(false) }} className="w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#5d626c] hover:bg-[#f5f6f7]">Profile and preferences</button>
          </div>}
        </div>
      </div>
    </header>
  )
}

function MobileNavigation({ isTraderView }) {
  const items = isTraderView
    ? traderNavigationSections.flatMap((section) => section.items)
    : navigation
  return <nav className="flex gap-1 overflow-x-auto border-b border-[#e8e9ec] bg-white px-3 py-2 lg:hidden" aria-label="Main navigation">{items.map((item) => <SidebarLink key={item.id} item={item} mobile />)}</nav>
}

function PageIntro({ title, subtitle, action }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><h1 className="text-[26px] font-semibold tracking-tight text-[#262c3a] sm:text-[30px]">{title}</h1>{subtitle && <p className="mt-1.5 text-sm text-[#898d95]">{subtitle}</p>}</div>
      {action}
    </div>
  )
}

function Card({ children, className = '', tone = 'white', ...props }) {
  const backgroundColor = tone === 'forest' ? '#2563eb' : tone === 'soft' ? '#f5f6f8' : '#ffffff'
  return <section {...props} data-tone={tone} style={{ backgroundColor }} className={`rounded-2xl border border-[#e9eaed] shadow-[0_2px_10px_rgba(35,61,46,0.025)] ${className}`}>{children}</section>
}

function Change({ value }) {
  const positive = !value.startsWith('-')
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold ${positive ? 'text-[#2563eb]' : 'text-[#bd705a]'}`}><Icon name={positive ? 'up' : 'down'} size={13} />{value}</span>
}

function TrendChart({ range, setRange, compact = false, category = null }) {
  const categoryLabel = portfolioCategories.find((item) => item.id === category)?.label
  const data = useMemo(() => getTrendData(category || 'overall', range), [category, range])
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {!compact && <div><p className="text-xs text-[#989ca3]">Portfolio value</p><p className="mt-1 text-xl font-semibold tracking-tight text-[#2c3242]">{formatPeso(24680.5)}</p></div>}
        <div className="ml-auto flex items-center gap-1 rounded-lg bg-[#f5f6f7] p-1">
          {Object.keys(rangeReturns).map((option) => <button type="button" key={option} onClick={() => setRange(option)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition ${range === option ? 'bg-white text-[#36415c] shadow-sm' : 'text-[#9a9da3] hover:text-[#485062]'}`}>{option}</button>)}
        </div>
      </div>
      <div className={compact ? 'h-[210px]' : 'h-[220px]'} role="img" aria-label={`Portfolio performance chart${categoryLabel ? ` for ${categoryLabel}` : ''} for ${range}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <CartesianGrid stroke="#edeef0" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#a1a4aa', fontSize: 10 }} interval={Math.max(0, Math.floor((data.length - 1) / 3))} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a4aa', fontSize: 10 }}
              tickCount={4}
              tickFormatter={(value) => `₱${Number(value).toLocaleString('en-PH', { maximumFractionDigits: 0 })}`}
              width={72}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip
              cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 4' }}
              contentStyle={{ border: '1px solid #e7e9ec', borderRadius: '12px', boxShadow: '0 8px 24px rgba(35, 45, 65, 0.10)', fontSize: '11px' }}
              labelStyle={{ color: '#858b97', marginBottom: '4px' }}
              formatter={(value) => [formatPeso(Number(value)), categoryLabel || 'Portfolio value']}
            />
            <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: '#ffffff', stroke: '#2563eb', strokeWidth: 2 }} animationDuration={350} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CategoryTrendChart({ range, setRange, category, selectedAccountId, accounts = investmentAccounts, categories = portfolioCategories }) {
  const categoryData = categories.find((item) => item.id === category) || categories[0]
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId)
  const chartCategory = selectedAccount?.category || categoryData.id
  const benchmark = categoryBenchmarks[chartCategory] || categoryBenchmarks.overall
  const series = getCategoryChartSeries(categoryData.id, selectedAccountId, accounts, categories)
  const data = useMemo(() => getCategoryPerformanceData(categoryData.id, range, selectedAccountId, accounts, categories), [categoryData.id, range, selectedAccountId, accounts, categories])
  const showLegend = categoryData.id === 'overall' || Boolean(selectedAccount)

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#8d929e]">{selectedAccount ? `${selectedAccount.name} vs market` : categoryData.id === 'overall' ? 'Portfolio vs market' : `Account performance · ${categoryData.label}`}</p>
          {showLegend && <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {series.map((item) => <span key={item.id} className="inline-flex items-center gap-1.5 text-[10px] text-[#7e8490]"><span className={`w-4 border-t-2 ${item.benchmark ? 'border-dashed' : ''}`} style={{ borderColor: item.color }} />{item.name}</span>)}
          </div>}
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-lg bg-[#f5f6f7] p-1">
          {Object.keys(rangeReturns).map((option) => <button type="button" key={option} onClick={() => setRange(option)} className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition ${range === option ? 'bg-white text-[#36415c] shadow-sm' : 'text-[#9a9da3] hover:text-[#485062]'}`}>{option}</button>)}
        </div>
      </div>
      <div className="-ml-2 h-[210px]" role="img" aria-label={`${selectedAccount ? selectedAccount.name : categoryData.label} performance compared with ${benchmark.name} for ${range}`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#edeef0" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#a1a4aa', fontSize: 10 }} interval={Math.max(0, Math.floor((data.length - 1) / 3))} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a4aa', fontSize: 10 }}
              tickCount={4}
              tickFormatter={(value) => formatReturn(Number(value))}
              width={50}
              domain={['auto', 'auto']}
            />
            <Tooltip
              cursor={{ stroke: '#cbd5e1', strokeDasharray: '3 4' }}
              contentStyle={{ border: '1px solid #e7e9ec', borderRadius: '12px', boxShadow: '0 8px 24px rgba(35, 45, 65, 0.10)', fontSize: '11px' }}
              labelStyle={{ color: '#858b97', marginBottom: '4px' }}
              formatter={(value, name) => [formatReturn(Number(value)), name]}
            />
            {series.map((item) => <Line key={item.id} type="monotone" dataKey={item.id} name={item.name} stroke={item.color} strokeWidth={item.benchmark ? 2 : 2.4} strokeDasharray={item.benchmark ? '6 4' : undefined} dot={false} activeDot={{ r: 4, fill: '#ffffff', stroke: item.color, strokeWidth: 2 }} animationDuration={350} />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CategoryAccountsList({ category, range, selectedAccountId, onSelectAccount, accounts: allAccounts = investmentAccounts, categories = portfolioCategories }) {
  const navigate = useNavigate()
  const categoryData = categories.find((item) => item.id === category) || categories[0]
  const accounts = getCategoryAccounts(categoryData.id, allAccounts)
  const multiplier = rangeReturnMultipliers[range]

  const handleToggleAccount = (accountId, cardElement = null) => {
    const nextId = selectedAccountId === accountId ? null : accountId
    onSelectAccount(nextId)
    if (nextId && cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    }
  }

  return (
    <section aria-label={`${categoryData.label} accounts`}>
      <div className="relative">
        <div
          className="visible-x-scrollbar flex w-full items-start snap-x snap-mandatory gap-2.5 overflow-x-scroll scroll-smooth pb-3 pt-0.5"
          aria-label="Scrollable investment accounts"
        >
          {accounts.map((account) => {
            const isSelected = selectedAccountId === account.id
            const accountCategory = categories.find((item) => item.id === account.category)
            const categoryColor = accountCategory?.color || account.color
            return (
              <div key={account.id} className="flex w-[calc((100%-10px)/2)] shrink-0 snap-start flex-col sm:w-[calc((100%-20px)/3)]">
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={(event) => handleToggleAccount(account.id, event.currentTarget.parentElement)}
                  className={`relative z-10 w-full rounded-xl border p-2.5 text-left transition ${
                    isSelected
                      ? 'account-card-selected border-[#9aa5b8] bg-white shadow-[0_3px_10px_rgba(35,45,65,0.08)]'
                      : 'border-[#e9ebef] bg-white hover:border-[#cfd5e0] hover:bg-[#fafbfc]'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: categoryColor }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-semibold text-[#454b58]" title={account.name}>{account.name}</span>
                      <span className="mt-0.5 flex items-center gap-1 text-[8.5px] tracking-tight">
                        <span className="font-semibold" style={{ color: categoryColor }}>{accountCategory?.label}</span>
                        <span className="text-[#c1c6d0]">·</span>
                        <span className="truncate font-mono text-[#989da7]">{account.accountNumber}</span>
                      </span>
                    </span>
                  </span>
                  <span className="mt-1.5 block text-xs font-semibold tracking-tight text-[#343a48]">{formatPeso(account.value)}</span>
                  <span className="mt-1 flex items-center justify-between gap-1.5">
                    <span className="text-[9px] text-[#9399a5]">{range} return</span>
                    <span className="text-[9.5px] font-semibold text-[#2563eb]">{formatReturn(account.monthlyReturn * multiplier)}</span>
                  </span>
                </button>

                {isSelected && (
                  <div
                    role="region"
                    aria-label={`Quick actions for ${account.name}`}
                    className="account-attached-drawer relative z-0 -mt-2.5 rounded-b-xl border border-t-0 border-[#d5dbe5] bg-white px-2 pb-2 pt-4 shadow-xs"
                  >
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate(`/funding?mode=deposit&account=${encodeURIComponent(account.id)}`)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#2563eb] px-2 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#1d4ed8]"
                      >
                        <ArrowDownLeft size={12} />
                        <span>Deposit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/funding?mode=withdraw&account=${encodeURIComponent(account.id)}`)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#dce1ea] bg-white px-2 py-1.5 text-[11px] font-semibold text-[#434a58] transition hover:border-[#b9c6db] hover:bg-[#f8f9fb]"
                      >
                        <ArrowUpRight size={12} />
                        <span>Withdraw</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function AllocationCard() {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-[#343a48]">Allocation</h2><button type="button" className="text-xs font-medium text-[#667086] hover:text-[#313d5a]">Details</button></div>
      <div className="my-6 flex justify-center">
        <div className="relative flex size-40 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#3b82f6 0 42%, #707c9a 42% 69%, #b4bac7 69% 87%, #d6a565 87% 94%, #e8eaee 94% 100%)' }}>
          <div className="flex size-[118px] flex-col items-center justify-center rounded-full bg-white"><span className="text-[10px] uppercase tracking-wider text-[#a1a4aa]">Invested</span><span className="mt-1 text-lg font-semibold text-[#2d3343]">₱21.4k</span></div>
        </div>
      </div>
      <div className="space-y-3">
        {[['US equities', '42%', '#3b82f6'], ['Global equities', '27%', '#707c9a'], ['Fixed income', '18%', '#b4bac7'], ['Individual stocks', '7%', '#d6a565']].map(([label, value, color]) => <div key={label} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2 text-[#787c86]"><span className="size-2 rounded-full" style={{ backgroundColor: color }} />{label}</span><span className="font-semibold text-[#525764]">{value}</span></div>)}
      </div>
    </Card>
  )
}

function HoldingMark({ ticker, color }) {
  return <span className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-bold tracking-tight text-white" style={{ backgroundColor: color }}>{ticker.slice(0, 3)}</span>
}

function HoldingsTable({ limit }) {
  const visible = limit ? holdings.slice(0, limit) : holdings
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[610px] text-left">
        <thead><tr className="border-b border-[#edeef0] text-[10px] font-semibold uppercase tracking-[0.1em] text-[#a0a3aa]"><th className="px-5 py-3 font-semibold sm:px-6">Investment</th><th className="px-4 py-3 font-semibold">Units</th><th className="px-4 py-3 text-right font-semibold">Value</th><th className="px-5 py-3 text-right font-semibold sm:px-6">Return</th></tr></thead>
        <tbody>{visible.map((holding) => <tr key={holding.ticker} className="border-b border-[#f0f1f2] last:border-0"><td className="px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><HoldingMark ticker={holding.ticker} color={holding.color} /><div><p className="text-sm font-semibold text-[#393e4b]">{holding.name}</p><p className="mt-0.5 text-xs text-[#9b9ea4]">{holding.ticker} · {holding.type}</p></div></div></td><td className="px-4 py-4 text-xs text-[#7f838c]">{holding.units}</td><td className="px-4 py-4 text-right text-sm font-semibold text-[#3d424e]">{formatPeso(holding.value)}</td><td className="px-5 py-4 text-right sm:px-6"><Change value={`${holding.change > 0 ? '+' : ''}${holding.change.toFixed(2)}%`} /></td></tr>)}</tbody>
      </table>
    </div>
  )
}

function ActivityList({ limit }) {
  return (
    <div className="divide-y divide-[#eff0f2]">
      {activities.slice(0, limit || activities.length).map((activity) => <div key={activity.title} className="flex items-center gap-3 py-4 first:pt-1 last:pb-0"><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${activity.kind === 'income' ? 'bg-[#edf0f5] text-[#5e6e92]' : activity.kind === 'deposit' ? 'bg-[#f4efe8] text-[#b9824d]' : 'bg-[#eff2f5] text-[#75869b]'}`}><Icon name={activity.kind === 'invest' ? 'portfolio' : activity.kind === 'deposit' ? 'plus' : 'up'} size={16} /></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#464b56]">{activity.title}</p><p className="mt-1 truncate text-[10px] text-[#a0a3aa]">{activity.detail}</p></div><span className={`shrink-0 text-xs font-semibold ${activity.amount.startsWith('+') ? 'text-[#485980]' : 'text-[#585c65]'}`}>{activity.amount}</span></div>)}
    </div>
  )
}

function PortfolioValueCard({ range, setRange, selectedCategory, setSelectedCategory, selectedAccountId, setSelectedAccountId, accounts = investmentAccounts, categories = portfolioCategories }) {
  const selectedData = categories.find((item) => item.id === selectedCategory) || categories[0]
  const selectedPera = categoryPeraBalances[selectedCategory] || categoryPeraBalances.overall
  const selectedCash = categoryCashBalances[selectedCategory] || categoryCashBalances.overall
  const [balanceView, setBalanceView] = useState(() => {
    try {
      return window.localStorage.getItem('morrow-balance-view') || 'assets'
    } catch {
      return 'assets'
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('morrow-balance-view', balanceView)
    } catch {
      // ignore
    }
  }, [balanceView])

  const [showChart, setShowChart] = useState(() => {
    try {
      const saved = window.localStorage.getItem('morrow-show-chart')
      return saved !== null ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('morrow-show-chart', JSON.stringify(showChart))
    } catch {
      // ignore
    }
  }, [showChart])

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
        <div className="min-w-0 space-y-4">
          <div>
            <div className="grid w-full grid-cols-2 items-end gap-0" role="tablist" aria-label="Balance view toggle">
              <button
                type="button"
                role="tab"
                aria-selected={balanceView === 'assets'}
                onClick={() => setBalanceView('assets')}
                className={`relative flex items-center justify-center gap-1.5 whitespace-nowrap rounded-tl-2xl border-l border-t border-r border-[#e9eaed] px-3.5 py-2.5 text-xs font-semibold transition sm:px-4 ${
                  balanceView === 'assets'
                    ? 'attached-tab-active z-10 -mb-px bg-white pb-[11px] text-[#2563eb]'
                    : 'attached-tab-inactive bg-[#f2f4f7] text-[#7e8490] hover:bg-[#eaedf2] hover:text-[#343a48]'
                }`}
              >
                <span>Total Assets</span>
                <span className={`hidden text-[10px] font-normal sm:inline ${balanceView === 'assets' ? 'text-[#2563eb]/85' : 'text-[#8b919d]'}`}>(Cash + Investments)</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={balanceView === 'cash'}
                onClick={() => setBalanceView('cash')}
                className={`relative flex items-center justify-center whitespace-nowrap rounded-tr-2xl border-t border-r border-[#e9eaed] px-3.5 py-2.5 text-xs font-semibold transition sm:px-4 ${
                  balanceView === 'cash'
                    ? 'attached-tab-active z-10 -mb-px bg-white pb-[11px] text-[#2563eb]'
                    : 'attached-tab-inactive bg-[#f2f4f7] text-[#7e8490] hover:bg-[#eaedf2] hover:text-[#343a48]'
                }`}
              >
                Available Cash
              </button>
            </div>

            <Card className="min-w-0 rounded-t-none p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <button
                    type="button"
                    aria-expanded={showChart}
                    aria-label="Toggle to view chart"
                    title="Toggle to view chart"
                    onClick={() => setShowChart(!showChart)}
                    className={`inline-flex items-center gap-2 rounded-full border border-[#c2c7d0] bg-transparent px-3.5 py-1.5 text-xs font-medium transition hover:border-[#989fae] hover:text-[#2563eb] dark:border-[#4b5262] dark:hover:border-[#636c80] dark:hover:text-[#60a5fa] ${
                      showChart
                        ? 'text-[#2563eb] dark:text-[#60a5fa]'
                        : 'text-[#555c6b] dark:text-[#9da3b1]'
                    }`}
                  >
                    <TrendingUp size={14} className={showChart ? 'text-[#2563eb] dark:text-[#60a5fa]' : 'text-[#8b919e]'} />
                    <span>Toggle to view chart</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showChart ? 'rotate-180 text-[#2563eb] dark:text-[#60a5fa]' : 'text-[#8b919e]'}`} />
                  </button>
                </div>
              </div>

            {balanceView === 'assets' ? (
              <div className="grid grid-cols-2 items-start gap-3 sm:gap-6">
                <div className="border-y border-transparent py-3.5 sm:py-5">
                  <p className="text-xs font-medium text-[#969aa1]">
                    {selectedCategory === 'overall' ? 'Total portfolio value' : `Total ${selectedData.label} value`}
                  </p>
                  <p className="mt-2 text-xl font-semibold leading-tight tracking-tight text-[#343a48] sm:text-[28px] lg:text-[32px]">
                    {formatPeso(selectedData.value)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <Change value={selectedData.change} />
                    <span className="text-[11px] font-medium text-[#7e8490]">
                      +{formatPeso(selectedData.changeAmount)} this month
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e5e7eb] bg-[#f4f6f8] p-3.5 text-right shadow-xs sm:p-5">
                  <p className="text-xs font-medium text-[#969aa1]">
                    {selectedCategory === 'overall' ? 'Total PERA asset' : `Total PERA asset (${selectedData.label})`}
                  </p>
                  <p className="mt-2 text-xl font-semibold leading-tight tracking-tight text-[#343a48] sm:text-[28px] lg:text-[32px]">
                    {formatPeso(selectedPera.value)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:gap-x-4">
                    <Change value={selectedPera.change} />
                    <span className="text-[11px] font-medium text-[#7e8490]">
                      +{formatPeso(selectedPera.changeAmount)} this month
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 items-start gap-3 sm:gap-6">
                <div className="border-y border-transparent py-3.5 sm:py-5">
                  <p className="text-xs font-medium text-[#969aa1]">
                    {selectedCategory === 'overall' ? 'Total available cash' : `Available cash (${selectedData.label})`}
                  </p>
                  <p className="mt-2 text-xl font-semibold leading-tight tracking-tight text-[#343a48] sm:text-[28px] lg:text-[32px]">
                    {formatPeso(selectedCash.nonPera)}
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e5e7eb] bg-[#f4f6f8] p-3.5 text-right shadow-xs sm:p-5">
                  <p className="text-xs font-medium text-[#969aa1]">
                    {selectedCategory === 'overall' ? 'Total available cash (PERA)' : `Available cash (${selectedData.label} · PERA)`}
                  </p>
                  <p className="mt-2 text-xl font-semibold leading-tight tracking-tight text-[#343a48] sm:text-[28px] lg:text-[32px]">
                    {formatPeso(selectedCash.pera)}
                  </p>
                </div>
              </div>
            )}

            {showChart && (
              <div className="mt-4 min-w-0 border-t border-[#edeef0] pt-4">
                <CategoryTrendChart range={range} setRange={setRange} category={selectedCategory} selectedAccountId={selectedAccountId} accounts={accounts} categories={categories} />
              </div>
            )}
            </Card>
          </div>

          <CategoryAccountsList category={selectedCategory} range={range} selectedAccountId={selectedAccountId} onSelectAccount={setSelectedAccountId} accounts={accounts} categories={categories} />
        </div>

        <Card className="flex flex-col p-4 sm:p-5">
          <h3 className="mb-3 text-xs font-semibold text-[#555c6a]">Categories</h3>
          <div role="tablist" aria-label="Portfolio categories" className="space-y-1.5">
            {categories.map((category) => {
              const isCategorySelected = selectedCategory === category.id
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={isCategorySelected}
                  onClick={() => { setSelectedCategory(category.id); setSelectedAccountId(null) }}
                  style={isCategorySelected ? { backgroundColor: `${category.color}14`, borderColor: `${category.color}40` } : undefined}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg border border-transparent px-3 py-2.5 text-left transition ${
                    isCategorySelected
                      ? ''
                      : 'text-[#777f8d] hover:bg-[#f8f9fb] hover:text-[#46536d]'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="min-w-0">
                      <span
                        className="block truncate text-[11px] font-semibold"
                        style={isCategorySelected ? { color: category.color } : undefined}
                      >
                        {category.label}
                      </span>
                      <span className="mt-0.5 block text-[9px] text-[#969ca7]">{formatPeso(category.value)}</span>
                    </span>
                  </span>
                  {isCategorySelected && <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />}
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const [range, setRange] = useState('1M')
  const [selectedCategory, setSelectedCategory] = useState('overall')
  const [selectedAccountId, setSelectedAccountId] = useState(null)

  return (
    <div className="space-y-6">
      <PortfolioValueCard range={range} setRange={setRange} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedAccountId={selectedAccountId} setSelectedAccountId={setSelectedAccountId} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.8fr)]">
        <Card className="overflow-hidden"><div className="flex items-center justify-between px-5 pb-2 pt-5 sm:px-6 sm:pt-6"><div><h2 className="text-sm font-semibold text-[#343a48]">Your investments</h2><p className="mt-1 text-xs text-[#9a9da4]">A quick look at your holdings</p></div><button onClick={() => navigate('/portfolio')} type="button" className="text-xs font-semibold text-[#646e84] hover:text-[#313e5d]">See all</button></div><HoldingsTable limit={3} /></Card>
        <Card className="p-5 sm:p-6"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-[#343a48]">Recent activity</h2><button onClick={() => navigate('/portfolio')} type="button" className="text-xs font-medium text-[#6f7789]">History</button></div><ActivityList limit={3} /></Card>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#e7e9ec] bg-[#f6f7f9] p-5 sm:flex-row sm:items-center sm:px-7"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#636f88] shadow-sm"><Icon name="learn" size={18} /></span><div><p className="text-sm font-semibold text-[#3d4351]">A little learning goes a long way</p><p className="mt-1 text-xs text-[#8c9099]">Explore bite-sized guides to investing with confidence.</p></div></div><button onClick={() => navigate('/learn')} type="button" className="inline-flex items-center gap-2 text-xs font-semibold text-[#525e79]">Explore the library <Icon name="arrow" size={14} /></button></div>
    </div>
  )
}

function PortfolioPage() {
  const navigate = useNavigate()
  const [range, setRange] = useState('1M')
  return (
    <div className="space-y-6">
      <PageIntro title="Your portfolio" subtitle="Track your investments and see how they're growing." action={<button onClick={() => navigate('/products')} type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d4ed8]"><Icon name="plus" size={16} />Explore investments</button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Total value", formatPeso(24680.5), 'Including cash balance'], ['Total invested', formatPeso(21420), 'Across 4 positions'], ['Total return', `+${formatPeso(1284.2)}`, '+5.49% all time']].map(([label, value, detail], i) => <Card key={label} className="p-5"><p className="text-xs text-[#9498a0]">{label}</p><p className={`mt-3 text-2xl font-semibold tracking-tight ${i === 2 ? 'text-[#445680]' : 'text-[#353b48]'}`}>{value}</p><p className="mt-1 text-xs text-[#a0a3a9]">{detail}</p></Card>)}
      </div>
      <Card className="p-5 sm:p-6"><TrendChart range={range} setRange={setRange} /></Card>
      <Card className="overflow-hidden"><div className="flex items-center justify-between px-5 pb-3 pt-5 sm:px-6 sm:pt-6"><div><h2 className="text-sm font-semibold text-[#343a48]">Holdings</h2><p className="mt-1 text-xs text-[#9a9da4]">Your current investments</p></div><button type="button" className="rounded-lg border border-[#e6e8eb] px-3 py-2 text-xs font-medium text-[#717580] hover:bg-[#f7f8f9]">Download statement</button></div><HoldingsTable /></Card>
      <Card className="p-5 sm:p-6"><h2 className="text-sm font-semibold text-[#343a48]">Activity</h2><div className="mt-4 grid gap-x-8 md:grid-cols-2"><ActivityList /></div></Card>
    </div>
  )
}

function ProductCard({ product, onExplore }) {
  const tints = { sage: 'bg-[#eaedf2] text-[#4a5878]', blue: 'bg-[#e9eff4] text-[#64839b]', sand: 'bg-[#f4eee5] text-[#ad8156]', lavender: 'bg-[#f0edf7] text-[#8574a5]', rose: 'bg-[#f5ebeb] text-[#ad7472]' }
  return (
    <Card className="flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between">
        <span className={`flex size-11 items-center justify-center rounded-[14px] text-xl ${tints[product.tint]}`}>{product.symbol}</span>
        <div className="flex items-center gap-1.5">
          {product.isNew && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-xs">
              <Sparkles size={9} className="text-amber-300 fill-amber-300 animate-sparkle" />
              New
            </span>
          )}
          <span className="rounded-full bg-[#f5f6f7] px-2.5 py-1 text-[10px] font-medium text-[#828690]">{product.category}</span>
        </div>
      </div>
      <h2 className="mt-5 text-[15px] font-semibold text-[#343a48]">{product.name}</h2><p className="mt-1.5 min-h-10 text-xs leading-5 text-[#90949c]">{product.detail}</p>
      <div className="my-5 grid grid-cols-2 gap-y-3 border-y border-[#edeef0] py-4 text-xs"><span className="text-[#9a9da4]">Historical return</span><span className="text-right font-semibold text-[#4e5d80]">{product.return}</span><span className="text-[#9a9da4]">Annual fee</span><span className="text-right font-medium text-[#626772]">{product.fee}</span><span className="text-[#9a9da4]">Starting amount</span><span className="text-right font-medium text-[#626772]">{product.minimum}</span></div>
      <div className="mt-auto flex items-center justify-between"><span className="text-[10px] text-[#a0a3aa]">{product.risk} risk · Demo data</span><button onClick={() => onExplore(product)} type="button" className="inline-flex items-center gap-1 text-xs font-semibold text-[#4d5b79] hover:text-[#2e3b5a]">Explore <Icon name="arrow" size={13} /></button></div>
    </Card>
  )
}

function ProductsPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const categories = ['All', 'Index funds', 'Fixed income', 'Cash', 'Retirement']
  const filtered = useMemo(() => products.filter((product) => (category === 'All' || product.category === category) && `${product.name} ${product.detail} ${product.category}`.toLowerCase().includes(search.toLowerCase())), [category, search])
  return (
    <div>
      <PageIntro title="Explore products" subtitle="Find options that fit your goals and investing style." />
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-[#edeef1] p-1">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} type="button" className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition ${category === item ? 'bg-white text-[#3b455b] shadow-sm' : 'text-[#898d96] hover:text-[#50596c]'}`}>{item}</button>)}</div>
        <label className="flex items-center gap-2 rounded-xl border border-[#e6e8eb] bg-white px-3 py-2.5 text-[#9599a0]"><Icon name="search" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="w-full bg-transparent text-xs text-[#434855] outline-none placeholder:text-[#a8abb0] sm:w-40" /></label>
      </div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs text-[#999ca3]">{filtered.length} options to explore</p>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[10px] font-semibold text-[#1d4ed8]">
            <Sparkles size={10} className="text-amber-500 fill-amber-400" />
            New funds added
          </span>
        </div>
        <span className="text-[10px] text-[#a7aaaf]">Returns shown are illustrative</span>
      </div>
      {filtered.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} onExplore={setSelectedProduct} />)}</div> : <Card className="p-12 text-center"><p className="text-sm font-medium text-[#666b76]">No matching products</p><p className="mt-1 text-xs text-[#9a9da4]">Try a different search or category.</p></Card>}
      {selectedProduct && <Modal title={selectedProduct.name} onClose={() => setSelectedProduct(null)}><p className="text-sm leading-6 text-[#7f838d]">{selectedProduct.detail}. This sample product page is for exploring the experience. Product details and performance shown here are illustrative.</p><div className="mt-5 rounded-xl bg-[#f5f6f8] p-4"><p className="text-xs text-[#9397a0]">Minimum investment</p><p className="mt-1 font-semibold text-[#404656]">{selectedProduct.minimum}</p></div><button onClick={() => { setSelectedProduct(null); navigate('/funding') }} type="button" className="mt-6 w-full rounded-xl bg-[#2563eb] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8]">Continue to funding</button></Modal>}
    </div>
  )
}

function FundingPage() {
  const location = useLocation()
  return <FundingPageContent key={location.search} search={location.search} />
}

function FundingPageContent({ search }) {
  const searchParams = new URLSearchParams(search)
  const initialMode = searchParams.get('mode') === 'withdraw' ? 'Withdraw' : 'Add money'
  const selectedAccount = investmentAccounts.find((item) => item.id === searchParams.get('account')) || null
  const selectedCategory = selectedAccount ? portfolioCategories.find((item) => item.id === selectedAccount.category) : null
  const [mode, setMode] = useState(initialMode)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bank')
  const [notice, setNotice] = useState('')
  const methods = [{ id: 'bank', name: 'Bank transfer', detail: '1–3 business days', mark: 'BK' }, { id: 'debit', name: 'Debit card', detail: 'Usually instant', mark: '••' }]
  const availableBalance = selectedAccount ? selectedAccount.value : 3260.5
  function handleSubmit(event) {
    event.preventDefault()
    if (!amount || Number(amount) <= 0) {
      setNotice('Enter an amount greater than ₱0 to continue.')
      return
    }
    setNotice(`${mode} request for ${formatPeso(Number(amount))}${selectedAccount ? ` (${selectedAccount.name})` : ''} is ready in this demo.`)
  }
  return (
    <div>
      <PageIntro title="Move money" subtitle="Add funds or transfer money out of your account." />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
        <Card className="p-5 sm:p-7">
          {selectedAccount && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-[#e6e9ef] bg-[#f8f9fb] px-4 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: selectedCategory?.color || selectedAccount.color }} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#343a48]">{selectedAccount.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-[#8d93a0]">
                    {selectedCategory && <span className="font-semibold" style={{ color: selectedCategory.color }}>{selectedCategory.label}</span>}
                    {selectedCategory && <span aria-hidden="true">·</span>}
                    <span className="font-mono">{selectedAccount.accountNumber}</span>
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-[#343a48]">{formatPeso(selectedAccount.value)}</span>
            </div>
          )}
          <div className="mb-7 flex rounded-xl bg-[#f2f3f5] p-1">{['Add money', 'Withdraw'].map((item) => <button key={item} onClick={() => { setMode(item); setNotice('') }} type="button" className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${mode === item ? 'bg-white text-[#3b455b] shadow-sm' : 'text-[#92969d]'}`}>{item}</button>)}</div>
          <form onSubmit={handleSubmit}>
            <label className="block text-xs font-semibold text-[#595e6a]" htmlFor="amount">{mode === 'Add money' ? 'How much would you like to add?' : 'How much would you like to withdraw?'}</label>
            <div className="mt-3 flex items-center rounded-xl border border-[#e4e6ea] px-4 py-4 focus-within:border-[#828da4]"><span className="mr-2 text-xl text-[#9a9ea5]">₱</span><input id="amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="w-full bg-transparent text-2xl font-semibold tracking-tight text-[#393f4e] outline-none placeholder:text-[#c1c4c9]" /><span className="text-xs text-[#9b9fa6]">PHP</span></div>
            <p className="mt-2 text-[10px] text-[#9da0a7]">{mode === 'Add money' ? `Available balance: ${formatPeso(availableBalance)}` : `Withdrawable balance: ${formatPeso(availableBalance)}`}</p>
            <div className="mt-7"><p className="mb-3 text-xs font-semibold text-[#595e6a]">Choose a method</p><div className="space-y-2">{methods.map((item) => <button key={item.id} onClick={() => setMethod(item.id)} type="button" className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${method === item.id ? 'border-[#7f8aa1] bg-[#f6f7fa]' : 'border-[#e9eaed] hover:bg-[#fafafb]'}`}><span className="flex size-10 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-[#666f81] shadow-sm">{item.mark}</span><span className="flex-1"><span className="block text-xs font-semibold text-[#525763]">{item.name}</span><span className="mt-1 block text-[10px] text-[#9a9da4]">{item.detail}</span></span><span className={`flex size-4 items-center justify-center rounded-full border ${method === item.id ? 'border-[#546282] bg-[#546282]' : 'border-[#d5d8dd]'}`}>{method === item.id && <span className="size-1.5 rounded-full bg-white" />}</span></button>)}</div></div>
            {notice && <p role="status" className={`mt-5 rounded-xl px-4 py-3 text-xs ${notice.startsWith('Enter') ? 'bg-[#fcf3ec] text-[#a06b43]' : 'bg-[#edf0f6] text-[#485674]'}`}>{notice}</p>}
            <button type="submit" className="mt-6 w-full rounded-xl bg-[#2563eb] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]">Review {mode.toLowerCase()}</button>
            <p className="mt-3 text-center text-[10px] leading-5 text-[#a0a3aa]">Demo only. No funds will be moved.</p>
          </form>
        </Card>
        <div className="space-y-4">
          <Card className="p-5 sm:p-6"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#edf0f4] text-[#5c6a87]"><Icon name="clock" size={18} /></span><div><h2 className="text-sm font-semibold text-[#424856]">Transfer timing</h2><p className="mt-1 text-xs text-[#979aa1]">Plan around processing times</p></div></div><div className="mt-5 space-y-4 border-t border-[#edeef0] pt-4"><div className="flex justify-between text-xs"><span className="text-[#8d919a]">Bank transfer</span><span className="font-medium text-[#666b75]">1–3 business days</span></div><div className="flex justify-between text-xs"><span className="text-[#8d919a]">Debit card</span><span className="font-medium text-[#666b75]">Usually instant</span></div></div></Card>
          <Card tone="soft" className="p-5 sm:p-6"><span className="flex size-9 items-center justify-center rounded-xl bg-white text-[#7e8695]"><Icon name="lock" size={16} /></span><h2 className="mt-4 text-sm font-semibold text-[#434a58]">Your security matters</h2><p className="mt-2 text-xs leading-5 text-[#8d919b]">Your linked account details are protected with encryption and secure verification in supported accounts.</p><button type="button" className="mt-3 text-xs font-semibold text-[#646e84]">Learn about security <span aria-hidden="true">→</span></button></Card>
        </div>
      </div>
    </div>
  )
}

function ProfilePage() {
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState(true)
  return (
    <div>
      <PageIntro title="Your profile" subtitle="Manage your personal details and preferences." />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="space-y-6">
          <Card className="p-5 sm:p-7"><div className="mb-6 flex items-center gap-4 border-b border-[#edeef0] pb-6"><Avatar className="size-16 rounded-2xl" iconSize={26} /><div><h2 className="text-sm font-semibold text-[#3f4553]">Alex Johnson</h2><p className="mt-1 text-xs text-[#9498a0]">Balanced risk profile · Member since 2023</p></div><button type="button" className="ml-auto rounded-lg border border-[#e6e8eb] px-3 py-2 text-xs font-medium text-[#727680] hover:bg-[#f7f8f9]">Change photo</button></div>
            <div className="grid gap-5 sm:grid-cols-2"><label className="text-xs font-medium text-[#727680]">First name<input defaultValue="Alex" className="mt-2 w-full rounded-xl border border-[#e6e8eb] bg-white px-3.5 py-3 text-sm text-[#444a56] outline-none focus:border-[#828da4]" /></label><label className="text-xs font-medium text-[#727680]">Last name<input defaultValue="Johnson" className="mt-2 w-full rounded-xl border border-[#e6e8eb] bg-white px-3.5 py-3 text-sm text-[#444a56] outline-none focus:border-[#828da4]" /></label><label className="text-xs font-medium text-[#727680]">Email address<input defaultValue="alex.johnson@example.com" type="email" className="mt-2 w-full rounded-xl border border-[#e6e8eb] bg-white px-3.5 py-3 text-sm text-[#444a56] outline-none focus:border-[#828da4]" /></label><label className="text-xs font-medium text-[#727680]">Phone number<input defaultValue="+1 (555) 014-8273" type="tel" className="mt-2 w-full rounded-xl border border-[#e6e8eb] bg-white px-3.5 py-3 text-sm text-[#444a56] outline-none focus:border-[#828da4]" /></label></div>
            {saved && <p role="status" className="mt-5 rounded-lg bg-[#edf0f6] px-4 py-3 text-xs text-[#485674]">Your demo profile changes have been saved.</p>}<div className="mt-6 flex justify-end"><button onClick={() => setSaved(true)} type="button" className="rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1d4ed8]">Save changes</button></div>
          </Card>
          <Card className="p-5 sm:p-7"><h2 className="text-sm font-semibold text-[#424856]">Preferences</h2><div className="mt-5 flex items-center justify-between border-t border-[#edeef0] pt-5"><div><p className="text-xs font-semibold text-[#5d636f]">Account updates</p><p className="mt-1 text-[10px] text-[#9a9da4]">Get updates about activity and account changes</p></div><button role="switch" aria-checked={notifications} onClick={() => setNotifications(!notifications)} type="button" className={`relative h-6 w-11 rounded-full transition ${notifications ? 'bg-[#536180]' : 'bg-[#cbced3]'}`}><span className={`absolute top-1 size-4 rounded-full bg-white transition ${notifications ? 'left-6' : 'left-1'}`} /></button></div><div className="mt-5 flex items-center justify-between border-t border-[#edeef0] pt-5"><div><p className="text-xs font-semibold text-[#5d636f]">Statement delivery</p><p className="mt-1 text-[10px] text-[#9a9da4]">Monthly statements sent by email</p></div><span className="text-xs font-medium text-[#787d87]">Monthly</span></div></Card>
        </div>
        <div className="space-y-4"><Card className="p-5 sm:p-6"><h2 className="text-sm font-semibold text-[#424856]">Account status</h2><div className="mt-4 flex items-center gap-2 rounded-lg bg-[#edf0f6] px-3 py-2.5"><span className="flex size-5 items-center justify-center rounded-full bg-[#6c7c9b] text-white"><Icon name="check" size={12} /></span><span className="text-xs font-medium text-[#566480]">Identity verified</span></div><div className="mt-5 space-y-3 text-xs"><div className="flex justify-between"><span className="text-[#979aa1]">Account type</span><span className="font-medium text-[#696e79]">Individual</span></div><div className="flex justify-between"><span className="text-[#979aa1]">Region</span><span className="font-medium text-[#696e79]">United States</span></div></div></Card><Card className="p-5 sm:p-6"><h2 className="text-sm font-semibold text-[#424856]">Need help?</h2><p className="mt-2 text-xs leading-5 text-[#8d919b]">Our support team can help with your account and preferences.</p><button type="button" className="mt-4 text-xs font-semibold text-[#5c6881]">Contact support <span aria-hidden="true">→</span></button></Card></div>
      </div>
    </div>
  )
}

function SettingsPage({ darkMode, setDarkMode }) {
  return (
    <div>
      <PageIntro title="Settings" subtitle="Manage your app preferences." />
      <Card className="max-w-2xl p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div><h2 className="text-sm font-semibold text-[#424856]">Appearance</h2><p className="mt-1 text-xs text-[#9296a0]">Choose day or night mode.</p></div>
          <button type="button" aria-pressed={darkMode} onClick={() => setDarkMode(!darkMode)} className="rounded-xl border border-[#e6e8eb] px-3.5 py-2.5 text-xs font-semibold text-[#59647a] transition hover:bg-[#f6f7f9]">{darkMode ? 'Night mode' : 'Day mode'}</button>
        </div>
      </Card>
    </div>
  )
}

function FaqPage() {
  const questions = [
    ['Are the values and returns live?', 'No. This prototype uses illustrative sample data.'],
    ['How do I compare an account with its benchmark?', 'Choose a category, then select an account card below the chart.'],
    ['Where can I ask for help?', 'Use Messages in the sidebar to view the sample support conversation.'],
  ]
  return (
    <div>
      <PageIntro title="Frequently asked questions" subtitle="Quick answers about this investment dashboard." />
      <div className="max-w-3xl space-y-3">{questions.map(([question, answer]) => <Card key={question} className="p-5"><h2 className="text-sm font-semibold text-[#424856]">{question}</h2><p className="mt-2 text-xs leading-5 text-[#858a95]">{answer}</p></Card>)}</div>
    </div>
  )
}

function PolicyPage({ title, documentName }) {
  return (
    <div>
      <PageIntro title={title} subtitle={`Information about Caballes-Go Securities ${documentName.toLowerCase()}.`} />
      <Card className="max-w-3xl p-5 sm:p-7"><p className="text-sm leading-6 text-[#747a87]">The approved CGSI {documentName.toLowerCase()} is not included in this demo. Please refer to Caballes-Go Securities’ official materials for the current document.</p></Card>
    </div>
  )
}

function SignOutPage() {
  const navigate = useNavigate()
  return (
    <div>
      <PageIntro title="Sign out" subtitle="End your current session." />
      <Card className="max-w-xl p-5 sm:p-7"><p className="text-sm leading-6 text-[#747a87]">This prototype is using a demo account, so there is no live session to end.</p><button type="button" onClick={() => navigate('/home')} className="mt-5 rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1d4ed8]">Return to dashboard</button></Card>
    </div>
  )
}

const articles = [
  { category: 'Getting started', title: 'Investing, explained in plain language', length: '5 min read', color: 'bg-[#e7ebf0]', illustration: '01', featured: true },
  { category: 'Building habits', title: 'Why consistency beats perfect timing', length: '4 min read', color: 'bg-[#f5eee4]', illustration: '02' },
  { category: 'Portfolio basics', title: 'A simple guide to diversification', length: '6 min read', color: 'bg-[#e8eff3]', illustration: '03' },
  { category: 'Understanding risk', title: 'Making sense of market ups and downs', length: '7 min read', color: 'bg-[#f3ebee]', illustration: '04' },
]

function LearnPage() {
  const [selectedArticle, setSelectedArticle] = useState(null)
  const featured = articles[0]
  return (
    <div>
      <PageIntro title="Learn at your pace" subtitle="Clear, practical guides for your investing journey." />
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#e5e8ed] bg-[#f1f4f7] px-4 py-3"><span className="flex size-8 items-center justify-center rounded-lg bg-white text-[#626e86]"><Icon name="learn" size={16} /></span><p className="text-xs text-[#717887]"><span className="font-semibold">2 new learning alerts:</span> fresh guides on diversification and investing habits.</p></div>
      <button onClick={() => setSelectedArticle(featured)} type="button" className="mb-7 grid w-full overflow-hidden rounded-2xl border border-[#e8eaed] bg-[#e9ecf1] text-left transition hover:shadow-md md:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 sm:p-9"><span className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#677081]">Featured guide · {featured.length}</span><h2 className="mt-5 max-w-md text-2xl font-semibold leading-tight tracking-tight text-[#343a48] sm:text-3xl">{featured.title}</h2><p className="mt-3 max-w-md text-sm leading-6 text-[#7d838d]">A friendly introduction to the ideas behind long-term investing and how to get started thoughtfully.</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#4e5b75]">Read the guide <Icon name="arrow" size={14} /></span></div>
        <div className="relative hidden min-h-[250px] items-center justify-center overflow-hidden md:flex"><div className="absolute size-64 rounded-full border border-[#c9ced8]" /><div className="absolute size-48 rounded-full border border-[#c9ced8]" /><div className="absolute size-32 rounded-full bg-[#b8c0cd]/50" /><span className="relative flex size-20 items-center justify-center rounded-3xl bg-white text-[#727c90] shadow-lg"><Icon name="learn" size={32} /></span><span className="absolute right-[20%] top-[25%] flex size-10 items-center justify-center rounded-xl bg-white text-[11px] text-[#727c90] shadow">%</span><span className="absolute bottom-[22%] left-[22%] flex size-10 items-center justify-center rounded-xl bg-white text-[11px] text-[#727c90] shadow">↗</span></div>
      </button>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold text-[#424856]">Explore topics</h2><button type="button" className="text-xs font-medium text-[#6f7789]">View all</button></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{articles.slice(1).map((article) => <button onClick={() => setSelectedArticle(article)} key={article.title} type="button" className="rounded-2xl border border-[#e8eaed] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"><span className={`flex h-28 items-center justify-center rounded-xl ${article.color}`}><span className="text-3xl font-light tracking-tight text-[#727c90]/70">{article.illustration}</span></span><span className="mt-4 block text-[10px] font-semibold uppercase tracking-wider text-[#8d94a1]">{article.category}</span><span className="mt-2 block text-sm font-semibold leading-5 text-[#424856]">{article.title}</span><span className="mt-3 flex items-center justify-between text-[10px] text-[#9ca0a7]"><span>{article.length}</span><span className="font-semibold text-[#667085]">Read article →</span></span></button>)}</div>
      {selectedArticle && <Modal title={selectedArticle.title} onClose={() => setSelectedArticle(null)}><p className="text-[10px] font-semibold uppercase tracking-wider text-[#788192]">{selectedArticle.category} · {selectedArticle.length}</p><p className="mt-4 text-sm leading-7 text-[#787c86]">Investing can be approached one step at a time. Start by setting a goal, choosing a comfortable pace, and learning how different investments may behave over time. Diversification and regular contributions can help you stay focused on your long-term plan.</p><p className="mt-3 text-sm leading-7 text-[#787c86]">Keep learning as your goals change. The right approach is personal, and it can be useful to review your choices periodically.</p></Modal>}
    </div>
  )
}

const threads = [
  { id: 1, title: 'Your monthly statement is ready', time: '9:15 AM', unread: true, preview: 'Your September account statement is now available in your profile.', avatar: 'M', color: 'bg-[#e9ecf1]', sender: 'Morrow Team' },
  { id: 2, title: 'Welcome to Morrow', time: 'Yesterday', unread: false, preview: 'We’re glad you’re here. Here are a few ways to get started.', avatar: 'M', color: 'bg-[#edf0f4]', sender: 'Morrow Team' },
  { id: 3, title: 'Scheduled deposit confirmed', time: 'Oct 12', unread: false, preview: 'Your recurring deposit is set for the 15th of each month.', avatar: 'M', color: 'bg-[#f3eee7]', sender: 'Morrow Team' },
]

function MessagesPage() {
  const [activeThread, setActiveThread] = useState(threads[0])
  const [reply, setReply] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <div>
      <PageIntro title="Messages" subtitle="Updates and notes about your account." />
      <Card className="grid min-h-[580px] overflow-hidden md:grid-cols-[300px_minmax(0,1fr)]">
        <div className="border-b border-[#edeef0] md:border-b-0 md:border-r"><div className="border-b border-[#edeef0] p-4"><label className="flex items-center gap-2 rounded-lg bg-[#f5f6f7] px-3 py-2 text-[#9b9ea5]"><Icon name="search" size={15} /><input placeholder="Search messages" className="w-full bg-transparent text-xs text-[#525763] outline-none placeholder:text-[#a7aab0]" /></label></div><div className="flex overflow-x-auto md:block">{threads.map((thread) => <button key={thread.id} onClick={() => { setActiveThread(thread); setSent(false) }} type="button" className={`min-w-[250px] flex-1 border-b border-[#f0f1f2] p-4 text-left transition hover:bg-[#fafafb] md:w-full ${activeThread.id === thread.id ? 'bg-[#f5f6f8]' : 'bg-white'}`}><span className="flex items-start gap-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-[#677083] ${thread.color}`}>{thread.avatar}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-xs font-semibold text-[#494e5a]">{thread.title}</span><span className="shrink-0 text-[9px] text-[#a0a3aa]">{thread.time}</span></span><span className="mt-1 block truncate text-[10px] text-[#989ca3]">{thread.preview}</span></span></span></button>)}</div></div>
        <div className="flex min-h-[440px] flex-col"><div className="flex items-center gap-3 border-b border-[#edeef0] px-5 py-4"><span className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold text-[#677083] ${activeThread.color}`}>{activeThread.avatar}</span><span><span className="block text-xs font-semibold text-[#484d59]">{activeThread.sender}</span><span className="mt-0.5 block text-[10px] text-[#9a9da4]">Account updates</span></span><span className="ml-auto rounded-full bg-[#f4f5f7] px-2.5 py-1 text-[9px] font-medium text-[#8a8e98]">{activeThread.time}</span></div><div className="flex-1 p-5 sm:p-7"><div className="max-w-xl rounded-2xl rounded-tl-sm bg-[#f4f5f7] p-4 sm:p-5"><p className="text-sm font-semibold text-[#434957]">{activeThread.title}</p><p className="mt-3 text-xs leading-6 text-[#7d818b]">{activeThread.preview}</p><p className="mt-3 text-xs leading-6 text-[#7d818b]">You can view more details anytime in your account. If you have questions, just reply to this message and our team will be happy to help.</p><p className="mt-4 text-[9px] text-[#a1a4aa]">{activeThread.time} · {activeThread.sender}</p></div>{sent && <div className="ml-auto mt-4 max-w-sm rounded-2xl rounded-tr-sm bg-[#eaedf2] p-4 text-xs text-[#555e71]">{reply || 'Thanks for the update.'}<p className="mt-2 text-right text-[9px] text-[#959aa3]">Just now · You</p></div>}</div><form onSubmit={(event) => { event.preventDefault(); if (reply.trim()) setSent(true) }} className="flex items-center gap-2 border-t border-[#edeef0] p-4"><input value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." className="min-w-0 flex-1 rounded-xl bg-[#f5f6f7] px-4 py-3 text-xs text-[#525763] outline-none placeholder:text-[#a5a8ae]" /><button aria-label="Send reply" type="submit" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2563eb] text-white transition hover:bg-[#1d4ed8]"><Icon name="send" size={17} /></button></form></div>
      </Card>
    </div>
  )
}

function Modal({ title, children, onClose }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#151a25]/35 p-4 backdrop-blur-[2px]" role="presentation" onClick={onClose}><section role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl border border-[#e7e9ec] bg-white p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><h2 className="text-lg font-semibold text-[#343a48]">{title}</h2><button onClick={onClose} type="button" aria-label="Close dialog" className="flex size-8 items-center justify-center rounded-lg text-[#8f939b] hover:bg-[#f3f4f6]">×</button></div>{children}</section></div>
}

const featuredInvestors = [
  { rank: 2, initials: 'MC', name: 'Maya C.', return: '+14.6%', podium: 'h-12', color: 'bg-[#eaf0fb] text-[#5573b0]' },
  { rank: 1, initials: 'JR', name: 'Jordan R.', return: '+18.2%', podium: 'h-20', color: 'bg-[#dce8ff] text-[#315fc2]' },
  { rank: 3, initials: 'SK', name: 'Sam K.', return: '+12.9%', podium: 'h-9', color: 'bg-[#eef2fa] text-[#7181a3]' },
]

const featuredInvestments = [
  { ticker: 'VTI', name: 'Total Market ETF', change: '+8.4%', tint: 'bg-[#eaf0fb] text-[#5573b0]' },
  { ticker: 'AAPL', name: 'Apple Inc.', change: '+7.2%', tint: 'bg-[#f0f1f4] text-[#596476]' },
  { ticker: 'NVDA', name: 'Nvidia Corp.', change: '+14.8%', tint: 'bg-[#edf2e9] text-[#64804d]' },
  { ticker: 'VXUS', name: 'International ETF', change: '+6.1%', tint: 'bg-[#f2eef9] text-[#806b9e]' },
  { ticker: 'BND', name: 'Total Bond ETF', change: '+4.2%', tint: 'bg-[#f5eee5] text-[#a17d55]' },
]

const sponsoredAds = [
  { id: 'growth', sponsor: 'BrightPath Funds', src: '/ad-growth.svg', alt: 'Sponsored by BrightPath Funds: Make room for long-term growth. Explore diversified options for your investing journey.' },
  { id: 'habits', sponsor: 'Northstar Investing', src: '/ad-habits.svg', alt: 'Sponsored by Northstar Investing: Steady habits. Stronger future. Explore a more consistent approach to investing.' },
  { id: 'plan', sponsor: 'Evergreen Asset Co.', src: '/ad-plan.svg', alt: 'Sponsored by Evergreen Asset Co.: Your next chapter starts with a plan. Discover tools for a thoughtful investment plan.' },
]
const sponsoredCtas = ['Try now', 'Explore', 'Learn how']

function CommunityRightRail() {
  const navigate = useNavigate()
  const [activeAd, setActiveAd] = useState(0)
  const [leftCtaLabel, setLeftCtaLabel] = useState(() => sponsoredCtas[Math.floor(Math.random() * sponsoredCtas.length)])
  const [selectedAd, setSelectedAd] = useState(null)
  const [showAllAds, setShowAllAds] = useState(false)
  const currentAd = sponsoredAds[activeAd]

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveAd((index) => (index + 1) % sponsoredAds.length)
    }, 5000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    setLeftCtaLabel(sponsoredCtas[Math.floor(Math.random() * sponsoredCtas.length)])
  }, [activeAd])

  return (
    <aside aria-label="Promotions and investment highlights" className="block scroll-pane xl:h-full xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-1">
      <div className="space-y-4 pt-6 xl:pt-0">
        <Card className="overflow-hidden p-0">
          <div role="region" aria-roledescription="carousel" aria-label="Sponsored advertisements" className="relative overflow-hidden rounded-2xl">
            <img key={currentAd.id} src={currentAd.src} alt={currentAd.alt} className="sponsored-ad-image block aspect-[4/3] w-full object-cover" />
            <div role="group" aria-label="Choose an advertisement" className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#13203b]/25 px-2 py-1.5 backdrop-blur-[2px]">
              <div className="flex items-center gap-1.5" aria-label="Choose an advertisement">
                {sponsoredAds.map((ad, index) => <button key={ad.id} type="button" aria-label={`Show advertisement ${index + 1}`} aria-pressed={activeAd === index} onClick={() => setActiveAd(index)} className={`h-1 rounded-full transition-all ${activeAd === index ? 'w-2.5 bg-white/70' : 'w-1 bg-white/40 hover:bg-white/70'}`} />)}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 px-3 py-2.5">
            <a href="#sponsored-ad" onClick={(event) => { event.preventDefault(); setSelectedAd(currentAd) }} className="text-[10px] font-semibold text-[#65708a] underline underline-offset-4 transition hover:text-[#2563eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]">{leftCtaLabel}</a>
            <a href="#all-sponsored-ads" onClick={(event) => { event.preventDefault(); setShowAllAds(true) }} className="text-[10px] font-semibold text-[#65708a] underline underline-offset-4 transition hover:text-[#2563eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]">View all</a>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9ca1ac]">For you</p><h2 className="mt-1 text-sm font-semibold text-[#343a48]">Investor podium</h2></div><span className="flex size-8 items-center justify-center rounded-lg bg-[#edf2ff] text-[#4a6fc4]"><Icon name="sparkles" size={16} /></span></div>
          <p className="mt-1 text-[10px] text-[#999da5]">Top 3 community investors</p>
          <div className="mt-4 flex h-[188px] items-end gap-1.5" aria-label="Top three investors ranked by illustrative returns">
            {featuredInvestors.map((investor) => <div key={investor.rank} className="flex min-w-0 flex-1 flex-col items-center justify-end">
              <div className="mb-2 flex flex-col items-center"><span className={`flex size-8 items-center justify-center rounded-full text-[9px] font-bold ${investor.color}`}>{investor.initials}</span><span className="mt-1.5 max-w-full truncate text-[9px] font-semibold text-[#4c5260]">{investor.name}</span><span className="mt-0.5 text-[9px] font-semibold text-[#4d70bd]">{investor.return}</span></div>
              <div className={`flex w-full items-center justify-center rounded-t-lg ${investor.podium} ${investor.rank === 1 ? 'bg-[#dfe9ff] text-[#3a66c4]' : 'bg-[#f0f3f8] text-[#7f8ba3]'}`}><span className="text-sm font-bold">{investor.rank}</span></div>
            </div>)}
          </div>
          <p className="mt-3 border-t border-[#edeef0] pt-3 text-[9px] leading-4 text-[#a3a6ad]">Sample community rankings and returns for demonstration.</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between"><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#9ca1ac]">Popular this week</p><h2 className="mt-1 text-sm font-semibold text-[#343a48]">Top 5 investments</h2></div><Icon name="medal" size={17} className="text-[#7183aa]" /></div>
          <div className="mt-3 divide-y divide-[#f0f1f3]">
            {featuredInvestments.map((investment, index) => <button key={investment.ticker} onClick={() => navigate('/products')} type="button" className="flex w-full items-center gap-2.5 py-2.5 text-left first:pt-1 last:pb-1 hover:bg-[#fafbfc]">
              <span className="w-3 text-[9px] font-semibold text-[#a3a6ad]">{index + 1}</span>
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-[8px] font-bold ${investment.tint}`}>{investment.ticker.slice(0, 2)}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-semibold text-[#4b505d]">{investment.name}</span><span className="mt-0.5 block text-[9px] text-[#9ca0a7]">{investment.ticker}</span></span>
              <span className="shrink-0 text-[9px] font-semibold text-[#4d70bd]">{investment.change}</span>
            </button>)}
          </div>
          <p className="mt-2 border-t border-[#edeef0] pt-2 text-[9px] leading-4 text-[#a3a6ad]">Illustrative returns; not investment advice.</p>
        </Card>
      </div>
      {selectedAd && <Modal title={selectedAd.sponsor} onClose={() => setSelectedAd(null)}><img src={selectedAd.src} alt={selectedAd.alt} className="mt-4 aspect-[4/3] w-full rounded-xl object-cover" /><p className="mt-3 text-xs leading-5 text-[#9296a0]">Sponsored sample content. Products and claims shown are illustrative.</p></Modal>}
      {showAllAds && <Modal title="All sponsored ads" onClose={() => setShowAllAds(false)}><div className="scroll-pane mt-4 max-h-[70vh] space-y-4 overflow-y-auto">{sponsoredAds.map((ad) => <img key={ad.id} src={ad.src} alt={ad.alt} className="aspect-[4/3] w-full rounded-xl object-cover" />)}</div></Modal>}
    </aside>
  )
}

const initialClientsData = [
  {
    id: 'client-1',
    name: 'Sofia Romero',
    accountNumber: 'CGSI-HNW-9041',
    category: 'High Net Worth',
    riskProfile: 'Growth',
    avatar: 'SR',
    color: 'bg-[#dbeafe] text-[#1e40af]',
    portfolioValue: 4820500,
    monthlyReturn: 14.2,
    cash: 642800,
    pera: 400000,
    status: 'Active',
    pendingOrderCount: 1,
    unreadCount: 1,
    lastActive: '10m ago',
    holdings: [
      { ticker: 'SMPH', name: 'SM Prime Holdings', shares: 35000, avgCost: 29.50, currentPrice: 32.80, value: 1148000, gain: 11.18, type: 'Equities' },
      { ticker: 'BDO', name: 'BDO Unibank', shares: 9200, avgCost: 142.00, currentPrice: 154.50, value: 1421400, gain: 8.80, type: 'Equities' },
      { ticker: 'ALI', name: 'Ayala Land Inc.', shares: 28000, avgCost: 31.00, currentPrice: 34.20, value: 957600, gain: 10.32, type: 'Equities' },
      { ticker: 'FMETF', name: 'First Metro ETF', shares: 6000, avgCost: 104.20, currentPrice: 108.50, value: 651000, gain: 4.12, type: 'UITF / ETF' },
    ],
    orders: [
      { id: 'ORD-9841', side: 'BUY', ticker: 'SMPH', shares: 5000, price: 32.50, type: 'LIMIT', status: 'PENDING', date: 'Today, 10:14 AM' },
      { id: 'ORD-9780', side: 'BUY', ticker: 'BDO', shares: 1200, price: 151.00, type: 'MARKET', status: 'EXECUTED', date: 'Yesterday' },
      { id: 'ORD-9512', side: 'DIVIDEND', ticker: 'ALI', shares: 28000, price: 0.42, type: 'REINVEST', status: 'EXECUTED', date: 'Oct 08, 2026' },
    ],
    messages: [
      { id: 'm1', sender: 'Sofia Romero', isClient: true, text: 'Hi Alex, looking over my monthly summary. Should we allocate more cash into SMPH before the REIT dividend cutoff?', time: '9:42 AM' },
      { id: 'm2', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Good morning Sofia! Yes, SMPH is holding solid support at ₱32.00 with dividend yields expected at 4.2%. I recommend queuing 5,000 shares at a ₱32.50 limit.', time: '10:05 AM' },
      { id: 'm3', sender: 'Sofia Romero', isClient: true, text: 'Sounds like a great plan. Please queue the 5,000 shares order for me.', time: '10:12 AM' },
      { id: 'm4', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Order ORD-9841 queued on PSE: Buy 5,000 SMPH @ ₱32.50 Limit. Will notify you as soon as the fill executes.', time: '10:14 AM' },
    ],
    previousMessages: [
      { id: 'pm-1', sender: 'Sofia Romero', isClient: true, text: 'Hi Alex, regarding our quarterly review, should we rebalance 15% from cash into SMPH and FMETF after the dividend record date?', time: 'Sep 18 · 2:15 PM' },
      { id: 'pm-2', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Hello Sofia! Yes, that rebalance locks in the dividend payout while maintaining growth targets. I have prepared the blotter for execution.', time: 'Sep 18 · 2:32 PM' },
      { id: 'pm-3', sender: 'Sofia Romero', isClient: true, text: 'Can you also check my annual statutory limit for personal equity retirement account (PERA) contributions?', time: 'Aug 24 · 11:10 AM' },
      { id: 'pm-4', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Your 2026 PERA cap is ₱200,000. All documents and Tax Form 1701 have been qualified for your 5% tax credit.', time: 'Aug 24 · 11:25 AM' },
    ],
    trades: [
      { id: 'TRD-9041-01', orderId: 'ORD-9780', side: 'BUY', ticker: 'BDO', name: 'BDO Unibank', shares: 1200, price: 151.00, gross: 181200, commission: 453.00, fees: 90.60, net: 181743.60, time: 'Yesterday, 2:15 PM', settlement: 'T+2 (Pending)', status: 'SETTLING', channel: 'Broker-Assisted Chat' },
      { id: 'TRD-9041-02', orderId: 'ORD-9512', side: 'BUY', ticker: 'ALI', name: 'Ayala Land Inc.', shares: 10000, price: 32.20, gross: 322000, commission: 805.00, fees: 161.00, net: 322966.00, time: 'Oct 08, 2026, 11:30 AM', settlement: 'T+2 Settled', status: 'SETTLED', channel: 'Advisory Phone Mandate' },
      { id: 'TRD-9041-03', orderId: 'ORD-9304', side: 'BUY', ticker: 'FMETF', name: 'First Metro ETF', shares: 3000, price: 106.50, gross: 319500, commission: 798.75, fees: 159.75, net: 320458.50, time: 'Sep 24, 2026, 1:45 PM', settlement: 'T+2 Settled', status: 'SETTLED', channel: 'Client Portal Request' },
      { id: 'TRD-9041-04', orderId: 'ORD-9118', side: 'SELL', ticker: 'AC', name: 'Ayala Corporation', shares: 400, price: 635.00, gross: 254000, commission: 635.00, fees: 127.00, net: 253238.00, time: 'Sep 12, 2026, 10:20 AM', settlement: 'T+2 Settled', status: 'SETTLED', channel: 'Broker-Assisted Chat' },
    ],
  },
  {
    id: 'client-2',
    name: 'Marcus Tan',
    accountNumber: 'CGSI-DISC-7712',
    category: 'Discretionary Equities',
    riskProfile: 'Balanced',
    avatar: 'MT',
    color: 'bg-[#d1fae5] text-[#065f46]',
    portfolioValue: 2140800,
    monthlyReturn: 9.8,
    cash: 310000,
    pera: 200000,
    status: 'Active',
    pendingOrderCount: 0,
    unreadCount: 1,
    lastActive: '1h ago',
    holdings: [
      { ticker: 'AC', name: 'Ayala Corporation', shares: 1800, avgCost: 615.00, currentPrice: 642.00, value: 1155600, gain: 4.39, type: 'Equities' },
      { ticker: 'ICT', name: 'Intl Container Terminal', shares: 2200, avgCost: 285.00, currentPrice: 307.00, value: 675400, gain: 7.71, type: 'Equities' },
    ],
    orders: [
      { id: 'ORD-8920', side: 'BUY', ticker: 'ICT', shares: 500, price: 302.00, type: 'LIMIT', status: 'EXECUTED', date: 'Oct 11, 2026' },
      { id: 'ORD-8812', side: 'SELL', ticker: 'TEL', shares: 250, price: 1350.00, type: 'LIMIT', status: 'EXECUTED', date: 'Oct 04, 2026' },
    ],
    messages: [
      { id: 'm1', sender: 'Marcus Tan', isClient: true, text: 'Hello Alex, please send me the latest UITF fund factsheet when convenient.', time: 'Yesterday' },
      { id: 'm2', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Sent over via your portal documents! Let me know if you want to increase monthly DCA allocations.', time: 'Yesterday' },
    ],
    previousMessages: [
      { id: 'pm-1', sender: 'Marcus Tan', isClient: true, text: 'Hello Alex, please send me the latest UITF fund factsheet when convenient.', time: 'Oct 11 · 4:10 PM' },
      { id: 'pm-2', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Sent over via your portal documents! Let me know if you want to increase monthly DCA allocations.', time: 'Oct 11 · 4:25 PM' },
      { id: 'pm-3', sender: 'Marcus Tan', isClient: true, text: 'TEL position was trimmed at ₱1,350 as planned. Thanks for executing.', time: 'Oct 04 · 10:45 AM' },
      { id: 'pm-4', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Confirmed, proceeds of ₱337,500 are settled in your discretionary cash balance.', time: 'Oct 04 · 11:00 AM' },
    ],
    trades: [
      { id: 'TRD-7712-01', orderId: 'ORD-8920', side: 'BUY', ticker: 'ICT', name: 'Intl Container Terminal', shares: 500, price: 302.00, gross: 151000, commission: 377.50, fees: 75.50, net: 151453.00, time: 'Oct 11, 2026, 10:45 AM', settlement: 'T+2 Settled', status: 'SETTLED', channel: 'Broker-Assisted Chat' },
      { id: 'TRD-7712-02', orderId: 'ORD-8812', side: 'SELL', ticker: 'TEL', name: 'PLDT Inc.', shares: 250, price: 1350.00, gross: 337500, commission: 843.75, fees: 168.75, net: 336487.50, time: 'Oct 04, 2026, 1:30 PM', settlement: 'T+2 Settled', status: 'SETTLED', channel: 'Advisory Phone Mandate' },
    ],
  },
  {
    id: 'client-3',
    name: 'Elena Bautista',
    accountNumber: 'CGSI-PERA-5520',
    category: 'PERA Tax-Exempt',
    riskProfile: 'Conservative',
    avatar: 'EB',
    color: 'bg-[#f3e8ff] text-[#6b21a8]',
    portfolioValue: 980400,
    monthlyReturn: 6.4,
    cash: 125500,
    pera: 400000,
    status: 'Review',
    pendingOrderCount: 1,
    unreadCount: 0,
    lastActive: '3h ago',
    holdings: [
      { ticker: 'BND', name: 'Total Bond ETF', shares: 8200, avgCost: 51.50, currentPrice: 53.20, value: 436240, gain: 3.30, type: 'Fixed Income' },
      { ticker: 'TEL', name: 'PLDT Inc.', shares: 300, avgCost: 1320.00, currentPrice: 1385.00, value: 415500, gain: 4.92, type: 'Equities' },
    ],
    orders: [
      { id: 'ORD-7640', side: 'BUY', ticker: 'BND', shares: 1000, price: 53.00, type: 'LIMIT', status: 'PENDING', date: 'Today, 8:30 AM' },
    ],
    messages: [
      { id: 'm1', sender: 'Elena Bautista', isClient: true, text: 'Alex, received my BIR 5% tax credit receipt for 2025 contributions. Thank you for processing!', time: 'Oct 09' },
    ],
    previousMessages: [
      { id: 'pm-1', sender: 'Elena Bautista', isClient: true, text: 'Alex, received my BIR 5% tax credit receipt for 2025 contributions. Thank you for processing!', time: 'Oct 09 · 3:30 PM' },
      { id: 'pm-2', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Glad to hear Elena! Your maximum tax credit of ₱10,000 is reflected on your statement.', time: 'Oct 09 · 3:45 PM' },
      { id: 'pm-3', sender: 'Elena Bautista', isClient: true, text: 'Should we increase our BND allocation before month end?', time: 'Sep 29 · 1:15 PM' },
      { id: 'pm-4', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Yes, fixed income yields are steady at 4.2%. Queuing for the next batch.', time: 'Sep 29 · 1:30 PM' },
    ],
    trades: [
      { id: 'TRD-5520-01', orderId: 'ORD-7510', side: 'BUY', ticker: 'BND', name: 'Total Bond ETF', shares: 2000, price: 52.80, gross: 105600, commission: 264.00, fees: 52.80, net: 105916.80, time: 'Sep 29, 2026, 11:10 AM', settlement: 'T+2 Settled', status: 'SETTLED', channel: 'PERA Tax-Exempt Order' },
      { id: 'TRD-5520-02', orderId: 'ORD-7390', side: 'BUY', ticker: 'TEL', name: 'PLDT Inc.', shares: 150, price: 1315.00, gross: 197250, commission: 493.13, fees: 98.62, net: 197841.75, time: 'Aug 18, 2026, 2:00 PM', settlement: 'T+2 Settled', status: 'SETTLED', channel: 'Broker-Assisted Advisory' },
    ],
  },
  {
    id: 'client-4',
    name: 'David Lim',
    accountNumber: 'CGSI-MRGN-3304',
    category: 'Margin Account',
    riskProfile: 'Aggressive',
    avatar: 'DL',
    color: 'bg-[#fef3c7] text-[#92400e]',
    portfolioValue: 3450000,
    monthlyReturn: 18.7,
    cash: 850000,
    pera: 0,
    status: 'Active',
    pendingOrderCount: 2,
    unreadCount: 0,
    lastActive: 'Yesterday',
    holdings: [
      { ticker: 'NVDA', name: 'Nvidia Corp. CDR', shares: 2500, avgCost: 480.00, currentPrice: 560.00, value: 1400000, gain: 16.67, type: 'Global Equities' },
      { ticker: 'MONDE', name: 'Monde Nissin', shares: 120000, avgCost: 9.80, currentPrice: 10.50, value: 1260000, gain: 7.14, type: 'Equities' },
    ],
    orders: [
      { id: 'ORD-6512', side: 'BUY', ticker: 'NVDA', shares: 500, price: 550.00, type: 'LIMIT', status: 'PENDING', date: 'Yesterday' },
      { id: 'ORD-6510', side: 'SELL', ticker: 'MONDE', shares: 20000, price: 10.70, type: 'LIMIT', status: 'PENDING', date: 'Oct 10' },
    ],
    messages: [
      { id: 'm1', sender: 'David Lim', isClient: true, text: 'Margin ratio looks good at 32%. Keeping the limit sell order on MONDE open.', time: 'Oct 10' },
    ],
    previousMessages: [
      { id: 'pm-1', sender: 'David Lim', isClient: true, text: 'Margin ratio looks good at 32%. Keeping the limit sell order on MONDE open.', time: 'Oct 10 · 1:20 PM' },
      { id: 'pm-2', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Noted David. Stop-loss trigger is set at ₱9.60 as a safety guard.', time: 'Oct 10 · 1:40 PM' },
      { id: 'pm-3', sender: 'David Lim', isClient: true, text: 'Let me know if NVDA CDR volatility spikes after the US earnings report.', time: 'Oct 02 · 9:10 AM' },
      { id: 'pm-4', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Monitoring closely. We have ample margin buffer at 35% equity.', time: 'Oct 02 · 9:30 AM' },
    ],
    trades: [
      { id: 'TRD-3304-01', orderId: 'ORD-6401', side: 'BUY', ticker: 'NVDA', name: 'Nvidia Corp. CDR', shares: 800, price: 520.00, gross: 416000, commission: 1040.00, fees: 208.00, net: 417248.00, time: 'Oct 02, 2026, 9:45 AM', settlement: 'T+2 Settled', status: 'SETTLED', channel: 'Margin Order Desk' },
      { id: 'TRD-3304-02', orderId: 'ORD-6218', side: 'BUY', ticker: 'MONDE', name: 'Monde Nissin', shares: 50000, price: 9.90, gross: 495000, commission: 1237.50, fees: 247.50, net: 496485.00, time: 'Sep 15, 2026, 10:30 AM', settlement: 'T+2 Settled', status: 'SETTLED', channel: 'Margin Order Desk' },
    ],
  },
  {
    id: 'client-5',
    name: 'Patricia Cruz',
    accountNumber: 'CGSI-TRST-1188',
    category: 'Discretionary Trust',
    riskProfile: 'Moderate',
    avatar: 'PC',
    color: 'bg-[#fce7f3] text-[#9d174d]',
    portfolioValue: 1260000,
    monthlyReturn: 5.1,
    cash: 94000,
    pera: 150000,
    status: 'Active',
    pendingOrderCount: 0,
    unreadCount: 0,
    lastActive: '2d ago',
    holdings: [
      { ticker: 'GLO', name: 'Globe Telecom', shares: 450, avgCost: 1720.00, currentPrice: 1790.00, value: 805500, gain: 4.07, type: 'Equities' },
      { ticker: 'UITF-BPI', name: 'Balanced Growth Fund', shares: 28000, avgCost: 12.80, currentPrice: 13.40, value: 375200, gain: 4.69, type: 'Mutual Fund' },
    ],
    orders: [
      { id: 'ORD-5410', side: 'BUY', ticker: 'GLO', shares: 100, price: 1750.00, type: 'MARKET', status: 'EXECUTED', date: 'Sep 28' },
    ],
    messages: [
      { id: 'm1', sender: 'Patricia Cruz', isClient: true, text: 'Confirming our quarterly trust allocation review next Tuesday at 2 PM.', time: 'Oct 08' },
    ],
    previousMessages: [
      { id: 'pm-1', sender: 'Patricia Cruz', isClient: true, text: 'Confirming our quarterly trust allocation review next Tuesday at 2 PM.', time: 'Oct 08 · 11:15 AM' },
      { id: 'pm-2', sender: 'Alex Johnson (Agent)', isClient: false, text: 'Calendar invite sent Patricia. Looking forward to reviewing the UITF balanced growth numbers.', time: 'Oct 08 · 11:30 AM' },
      { id: 'pm-3', sender: 'Patricia Cruz', isClient: true, text: 'Can you provide the dividend payout schedule for Globe Telecom?', time: 'Sep 25 · 2:00 PM' },
      { id: 'pm-4', sender: 'Alex Johnson (Agent)', isClient: false, text: 'GLO dividend ex-date is next week with ₱28.00/share declared.', time: 'Sep 25 · 2:20 PM' },
    ],
    trades: [
      { id: 'TRD-1188-01', orderId: 'ORD-5410', side: 'BUY', ticker: 'GLO', name: 'Globe Telecom', shares: 100, price: 1750.00, gross: 175000, commission: 437.50, fees: 87.50, net: 175525.00, time: 'Sep 28, 2026, 11:00 AM', settlement: 'T+2 Settled', status: 'SETTLED', channel: 'Trust Committee Order' },
    ],
  },
]

function ClientsPage() {
  const [clients, setClients] = useState(initialClientsData)
  const [selectedClientId, setSelectedClientId] = useState('client-1')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [leftTab, setLeftTab] = useState('clients')
  const [orderFilter, setOrderFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [activeTab, setActiveTab] = useState('trades')
  const [chatMode, setChatMode] = useState('live')
  const [replyText, setReplyText] = useState('')
  const [messageSearch, setMessageSearch] = useState('')
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderTicker, setOrderTicker] = useState('SMPH')
  const [orderSide, setOrderSide] = useState('BUY')
  const [orderShares, setOrderShares] = useState(1000)
  const [orderPrice, setOrderPrice] = useState(32.50)
  const [orderType, setOrderType] = useState('LIMIT')
  const [toastMessage, setToastMessage] = useState(null)

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0]

  // All client orders across desk
  const allDeskOrders = useMemo(() => {
    return clients.flatMap((client) =>
      client.orders.map((o) => ({
        ...o,
        clientId: client.id,
        clientName: client.name,
        clientAvatar: client.avatar,
        clientColor: client.color,
        accountNumber: client.accountNumber,
      }))
    )
  }, [clients])

  const pendingOrdersCount = useMemo(() => {
    return allDeskOrders.filter((o) => o.status === 'PENDING').length
  }, [allDeskOrders])

  const buyOrdersCount = useMemo(() => {
    return allDeskOrders.filter((o) => o.side === 'BUY').length
  }, [allDeskOrders])

  const sellOrdersCount = useMemo(() => {
    return allDeskOrders.filter((o) => o.side === 'SELL').length
  }, [allDeskOrders])

  const filteredOrders = useMemo(() => {
    return allDeskOrders.filter((order) => {
      const query = searchQuery.toLowerCase().trim()
      const matches =
        !query ||
        order.id.toLowerCase().includes(query) ||
        order.ticker.toLowerCase().includes(query) ||
        order.clientName.toLowerCase().includes(query) ||
        (order.accountNumber && order.accountNumber.toLowerCase().includes(query))
      if (!matches) return false
      if (orderFilter === 'PENDING') return order.status === 'PENDING'
      if (orderFilter === 'BUY') return order.side === 'BUY'
      if (orderFilter === 'SELL') return order.side === 'SELL'
      return true
    })
  }, [allDeskOrders, searchQuery, orderFilter])

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.holdings.some((h) => h.ticker.toLowerCase().includes(searchQuery.toLowerCase()))

    if (!matchesSearch) return false
    if (categoryFilter === 'HNW') return client.category.includes('High Net Worth')
    if (categoryFilter === 'DISC') return client.category.includes('Discretionary')
    if (categoryFilter === 'ORDERS') return client.orders.some((o) => o.status === 'PENDING')
    return true
  })

  const triggerToast = (msg) => {
    setToastMessage(msg)
    window.setTimeout(() => setToastMessage(null), 3500)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    const newMsg = {
      id: String(Date.now()),
      sender: 'Alex Johnson (Agent)',
      isClient: false,
      text: replyText.trim(),
      time: 'Just now',
    }

    setClients((prev) =>
      prev.map((c) => (c.id === selectedClient.id ? { ...c, messages: [...c.messages, newMsg] } : c))
    )
    setReplyText('')
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    const sharesNum = Number(orderShares)
    const priceNum = Number(orderPrice)
    if (!sharesNum || sharesNum <= 0 || !priceNum || priceNum <= 0) return

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      side: orderSide,
      ticker: orderTicker.toUpperCase(),
      shares: sharesNum,
      price: priceNum,
      type: orderType,
      status: 'PENDING',
      date: 'Just now',
    }

    const advisoryNote = {
      id: String(Date.now()),
      sender: 'Alex Johnson (Agent)',
      isClient: false,
      text: `Client order submitted: ${orderSide} ${sharesNum.toLocaleString()} ${newOrder.ticker} @ ₱${priceNum.toFixed(2)} (${orderType}). Order ID: ${newOrder.id}`,
      time: 'Just now',
    }

    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? {
              ...c,
              orders: [newOrder, ...c.orders],
              messages: [...c.messages, advisoryNote],
              pendingOrderCount: c.pendingOrderCount + 1,
            }
          : c
      )
    )

    setOrderModalOpen(false)
    triggerToast(`Order ${newOrder.id} successfully queued for ${selectedClient.name}`)
  }

  const handleCancelOrder = (orderId) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? {
              ...c,
              orders: c.orders.map((o) => (o.id === orderId ? { ...o, status: 'CANCELLED' } : o)),
              pendingOrderCount: Math.max(0, c.pendingOrderCount - 1),
            }
          : c
      )
    )
    triggerToast(`Order ${orderId} has been cancelled.`)
  }

  const handleExecuteOrder = (order) => {
    const gross = order.shares * order.price
    const commission = gross * 0.0025
    const fees = gross * 0.0005
    const net = order.side === 'BUY' ? gross + commission + fees : gross - commission - fees

    const newTrade = {
      id: `TRD-${Math.floor(1000 + Math.random() * 9000)}-01`,
      orderId: order.id,
      side: order.side,
      ticker: order.ticker,
      name: order.ticker,
      shares: order.shares,
      price: order.price,
      gross,
      commission,
      fees,
      net,
      time: 'Just now',
      settlement: 'T+2 (Pending)',
      status: 'SETTLING',
      channel: 'Broker-Assisted Execution',
    }

    const execNote = {
      id: String(Date.now()),
      sender: 'Alex Johnson (Agent)',
      isClient: false,
      text: `Execution complete: ${order.side} ${order.shares.toLocaleString()} ${order.ticker} @ ₱${order.price.toFixed(2)}. Net Settlement: ${formatPeso(net)}. Trade Ref: ${newTrade.id}`,
      time: 'Just now',
    }

    setClients((prev) =>
      prev.map((c) =>
        c.id === selectedClient.id
          ? {
              ...c,
              orders: c.orders.map((o) => (o.id === order.id ? { ...o, status: 'EXECUTED' } : o)),
              trades: [newTrade, ...(c.trades || [])],
              messages: [...c.messages, execNote],
              pendingOrderCount: Math.max(0, c.pendingOrderCount - 1),
              cash: order.side === 'BUY' ? Math.max(0, c.cash - net) : c.cash + net,
            }
          : c
      )
    )

    triggerToast(`Order ${order.id} executed on PSE! Trade confirmation ${newTrade.id} created.`)
  }

  const openOrderModalForHolding = (holding) => {
    setOrderTicker(holding.ticker)
    setOrderPrice(holding.currentPrice)
    setOrderShares(500)
    setOrderSide('BUY')
    setOrderModalOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#1e293b] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in">
          <CheckCircle2 size={16} className="text-[#34d399]" />
          <span>{toastMessage}</span>
        </div>
      )}


      {/* 3-Panel Layout: Left (Clients), Middle (Financials & Orders), Right (Messaging) */}
      <Card className="grid min-h-[720px] overflow-hidden rounded-2xl border border-[#e8eaed] bg-white xl:grid-cols-[280px_minmax(0,1fr)_340px] 2xl:grid-cols-[300px_minmax(0,1fr)_360px] lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Panel 1: Clients & Orders Tabs (Left) */}
        <div className="flex flex-col border-b border-[#edeef0] lg:border-b-0 lg:border-r">
          {/* Top Tabs: Clients vs Orders with Badges */}
          <div className="border-b border-[#edeef0] bg-white p-2.5">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#f2f4f7] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLeftTab('clients')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] transition ${
                  leftTab === 'clients' ? 'bg-white text-[#2563eb] shadow-2xs font-bold' : 'text-[#6b7280] hover:text-[#1f2937]'
                }`}
              >
                <Users size={13} />
                <span>Clients</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                  leftTab === 'clients' ? 'bg-[#2563eb] text-white' : 'bg-[#e5e7eb] text-[#4b5563]'
                }`}>
                  {clients.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLeftTab('orders')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] transition ${
                  leftTab === 'orders' ? 'bg-white text-[#2563eb] shadow-2xs font-bold' : 'text-[#6b7280] hover:text-[#1f2937]'
                }`}
              >
                <ArrowUpDown size={13} />
                <span>Orders</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                  leftTab === 'orders'
                    ? 'bg-[#2563eb] text-white'
                    : pendingOrdersCount > 0
                    ? 'bg-[#fef3c7] text-[#92400e]'
                    : 'bg-[#e5e7eb] text-[#4b5563]'
                }`}>
                  {allDeskOrders.length}
                </span>
              </button>
            </div>
          </div>

          {/* Search & Filter Header */}
          <div className="border-b border-[#edeef0] p-3">
            <label className="relative flex items-center gap-2 rounded-xl bg-[#f5f6f7] px-3 py-2 text-[#9b9ea5]">
              <Search size={14} className="shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={leftTab === 'clients' ? 'Search clients or ticker...' : 'Filter ticker, client, or ID...'}
                className="w-full bg-transparent text-xs text-[#525763] outline-none placeholder:text-[#a7aab0] pr-5"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-[#9ca3af] hover:text-[#475569] transition"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </label>

            {leftTab === 'clients' ? (
              <div className="mt-2.5 flex items-center gap-1 overflow-x-auto text-[10px] scroll-pane">
                {[
                  { id: 'ALL', label: `All (${clients.length})` },
                  { id: 'HNW', label: 'HNW' },
                  { id: 'DISC', label: 'Discretionary' },
                  { id: 'ORDERS', label: 'With Orders' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setCategoryFilter(f.id)}
                    className={`rounded-lg px-2 py-1 font-semibold transition shrink-0 ${
                      categoryFilter === f.id ? 'bg-[#2563eb] text-white' : 'bg-[#f4f5f7] text-[#6b7280] hover:bg-[#eaecee]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-2.5 flex items-center gap-1 overflow-x-auto text-[10px] scroll-pane">
                {[
                  { id: 'ALL', label: `All (${allDeskOrders.length})` },
                  { id: 'PENDING', label: `Pending (${pendingOrdersCount})` },
                  { id: 'BUY', label: `Buys (${buyOrdersCount})` },
                  { id: 'SELL', label: `Sells (${sellOrdersCount})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setOrderFilter(f.id)}
                    className={`rounded-lg px-2 py-1 font-semibold transition shrink-0 ${
                      orderFilter === f.id ? 'bg-[#2563eb] text-white' : 'bg-[#f4f5f7] text-[#6b7280] hover:bg-[#eaecee]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* List Content: Clients View vs Orders View */}
          <div className="scroll-pane flex-1 overflow-y-auto divide-y divide-[#f2f4f6]">
            {leftTab === 'clients' ? (
              filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const isSelected = client.id === selectedClient.id
                  return (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => {
                        setSelectedClientId(client.id)
                        setSelectedOrderId(null)
                      }}
                      className={`w-full p-3.5 text-left transition hover:bg-[#f9fafb] ${isSelected ? 'bg-[#f0f5ff]' : 'bg-white'}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${client.color}`}>
                          {client.avatar}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="truncate text-xs font-semibold text-[#2c3342]">{client.name}</span>
                            <span className="shrink-0 text-[10px] font-bold text-[#059669]">+{client.monthlyReturn}%</span>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#8c929e]">
                            <span>{client.accountNumber}</span>
                            <span>·</span>
                            <span className="truncate">{client.riskProfile}</span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-[#374151]">{formatPeso(client.portfolioValue)}</span>
                            {client.pendingOrderCount > 0 ? (
                              <span className="rounded-full bg-[#fef3c7] px-1.5 py-0.5 text-[9px] font-bold text-[#92400e]">
                                {client.pendingOrderCount} pending
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#9ca3af]">{client.lastActive}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="p-6 text-center text-xs text-[#9ca3af]">No clients match the current filter.</div>
              )
            ) : (
              /* Left Tab 2: Orders List across clients with Clear Design Hierarchy */
              filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isSelected = order.id === selectedOrderId || (!selectedOrderId && order.clientId === selectedClient.id)
                  const totalValue = order.shares * order.price

                  return (
                    <button
                      key={`${order.clientId}-${order.id}`}
                      type="button"
                      onClick={() => {
                        setSelectedClientId(order.clientId)
                        setSelectedOrderId(order.id)
                        setActiveTab('orders')
                      }}
                      className={`group relative w-full text-left p-3.5 transition border-b border-[#f1f3f6] border-l-[3.5px] ${
                        isSelected
                          ? 'border-l-[#2563eb] bg-[#eff6ff]/90'
                          : 'border-l-transparent bg-white hover:bg-[#f8fafc]'
                      }`}
                    >
                      {/* Top Row: Side Badge + Ticker + Type | Total Estimated Value (Primary Hierarchy) */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide shrink-0 ${
                              order.side === 'BUY'
                                ? 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]'
                                : order.side === 'SELL'
                                ? 'bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]'
                                : 'bg-[#e0e7ff] text-[#4338ca] border border-[#c7d2fe]'
                            }`}
                          >
                            {order.side}
                          </span>
                          <span className="text-[13px] font-bold text-[#0f172a] tracking-tight group-hover:text-[#2563eb] transition-colors">
                            {order.ticker}
                          </span>
                          <span className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#64748b]">
                            {order.type}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#0f172a] tabular-nums shrink-0">
                          {formatPeso(totalValue)}
                        </span>
                      </div>

                      {/* Middle Row: Quantity & Limit Price Terms | Live Order Status (Secondary Hierarchy) */}
                      <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-1 text-[#475467] min-w-0 truncate">
                          <span className="font-semibold text-[#334155]">{order.shares.toLocaleString()}</span>
                          <span className="text-[#94a3b8]">shs @</span>
                          <span className="font-semibold text-[#1e293b] tabular-nums">₱{order.price.toFixed(2)}</span>
                        </div>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            order.status === 'PENDING'
                              ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                              : order.status === 'EXECUTED'
                              ? 'bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]'
                              : 'bg-[#f1f5f9] text-[#64748b] border border-[#e2e8f0]'
                          }`}
                        >
                          {order.status === 'PENDING' && (
                            <span className="size-1.5 rounded-full bg-[#d97706] animate-pulse" />
                          )}
                          {order.status === 'EXECUTED' && (
                            <CheckCircle2 size={10} className="text-[#059669]" />
                          )}
                          {order.status}
                        </span>
                      </div>

                      {/* Bottom Row: Client Attribution & Order Timestamp/ID (Tertiary Hierarchy) */}
                      <div className="mt-2 flex items-center justify-between gap-2 border-t border-[#f1f3f6]/80 pt-1.5 text-[10px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`flex size-4.5 shrink-0 items-center justify-center rounded-full text-[8.5px] font-bold ${order.clientColor}`}>
                            {order.clientAvatar}
                          </span>
                          <span className="truncate font-medium text-[#475467]">{order.clientName}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 text-[#94a3b8] font-mono text-[9px]">
                          <span>{order.date}</span>
                          <span>·</span>
                          <span>#{order.id}</span>
                        </div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#f1f5f9] text-[#94a3b8]">
                    <ArrowUpDown size={18} />
                  </div>
                  <p className="mt-2.5 text-xs font-semibold text-[#334155]">No orders found</p>
                  <p className="mt-1 text-[11px] text-[#94a3b8] max-w-[190px]">
                    {searchQuery
                      ? `No orders matching "${searchQuery}"`
                      : orderFilter === 'PENDING'
                      ? 'No pending orders waiting for execution.'
                      : 'No orders match this filter.'}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Panel 2: Client Financial Information, Trades & Order Blotter (Middle - Largest) */}
        <div className="flex min-w-0 flex-1 flex-col border-b border-[#edeef0] xl:border-b-0 xl:border-r">
          {/* Client Summary Top Bar - Broker-Assisted Trading Account Card */}
          <div className="border-b border-[#edeef0] bg-[#fafbfc] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl font-bold text-sm ${selectedClient.color}`}>
                {selectedClient.avatar}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-base font-semibold text-[#242935]">{selectedClient.name}</h2>
                  <span className="rounded-md bg-[#eff6ff] border border-[#bfdbfe] px-2 py-0.5 text-[9.5px] font-bold uppercase text-[#1d4ed8]">
                    Broker-Assisted Account
                  </span>
                  <span className="rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[9.5px] font-medium text-[#4b5563]">
                    {selectedClient.category}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#8a909d]">
                  Account #{selectedClient.accountNumber} · Risk: <span className="font-medium text-[#475467]">{selectedClient.riskProfile}</span>
                </p>
              </div>
            </div>

            {/* Broker-Assisted Trading Stats Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <div className="rounded-xl border border-[#e5e7eb] bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af]">Buying Power</p>
                  <span className="size-1.5 rounded-full bg-[#10b981]" title="Funds Settled" />
                </div>
                <p className="mt-1 text-sm font-bold text-[#1f2937] sm:text-base">{formatPeso(selectedClient.cash)}</p>
                <p className="mt-0.5 text-[10px] text-[#059669] font-medium">Ready for immediate fill</p>
              </div>

              <div className="rounded-xl border border-[#e5e7eb] bg-white p-3 shadow-2xs">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af]">Trading Facility</p>
                <p className="mt-1 text-sm font-bold text-[#1f2937] sm:text-base">{formatPeso(selectedClient.cash * 1.5 + 500000)}</p>
                <p className="mt-0.5 text-[10px] text-[#6b7280]">Approved intraday credit buffer</p>
              </div>

              <div className="rounded-xl border border-[#e5e7eb] bg-white p-3 shadow-2xs">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af]">T+2 Clearing Balance</p>
                <p className="mt-1 text-sm font-bold text-[#1f2937] sm:text-base">
                  {formatPeso((selectedClient.trades && selectedClient.trades[0]?.net) || 181743.60)}
                </p>
                <p className="mt-0.5 text-[10px] text-[#2563eb] font-medium">Next settlement cycle (PSE T+2)</p>
              </div>

              <div className="rounded-xl border border-[#e5e7eb] bg-white p-3 shadow-2xs">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#9ca3af]">Assisted Commission</p>
                <p className="mt-1 text-sm font-bold text-[#1f2937] sm:text-base">0.25% PSE Standard</p>
                <p className="mt-0.5 text-[10px] text-[#d97706] font-medium">
                  {selectedClient.orders.filter((o) => o.status === 'PENDING').length} active orders pending fill
                </p>
              </div>
            </div>
          </div>

          {/* Middle Tabs: Trades vs Orders */}
          <div className="flex border-b border-[#edeef0] bg-[#fafbfc] px-5 text-xs font-semibold">
            {[
              { id: 'trades', label: 'Trades', badge: (selectedClient.trades || []).length },
              { id: 'orders', label: 'Orders', badge: (selectedClient.orders || []).length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 py-3 px-3 transition ${
                  activeTab === tab.id
                    ? 'text-[#2563eb] font-bold border-b-2 border-[#2563eb]'
                    : 'text-[#6b7280] hover:text-[#2563eb]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[9px] ${
                    activeTab === tab.id ? 'bg-[#2563eb] text-white' : 'bg-[#e5e7eb] text-[#6b7280]'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Middle Tab 1: Trades (Executed Trades & Confirmations) */}
          {activeTab === 'trades' && (
            <div className="scroll-pane flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold text-[#1f2937]">Executed Trades &amp; Confirmations</h3>
                  <p className="text-[11px] text-[#8e94a0]">
                    Broker-assisted transaction logs, fill confirmations, and T+2 settlement records for {selectedClient.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast(`Exported ${selectedClient.trades?.length || 0} trade confirmation slips for ${selectedClient.name}`)}
                  className="rounded-xl border border-[#d3d7e0] bg-white px-3 py-1.5 text-xs font-semibold text-[#4b5262] transition hover:bg-[#f6f7f9] self-start sm:self-auto"
                >
                  Export Confirmations
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-3">
                  <p className="text-[10px] font-semibold uppercase text-[#6b7280]">Total Traded Value</p>
                  <p className="mt-1 text-sm font-bold text-[#1f2937]">
                    {formatPeso((selectedClient.trades || []).reduce((acc, t) => acc + (t.gross || 0), 0))}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#2563eb]">Gross turnover across {(selectedClient.trades || []).length} trades</p>
                </div>
                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-3">
                  <p className="text-[10px] font-semibold uppercase text-[#6b7280]">Total Commission</p>
                  <p className="mt-1 text-sm font-bold text-[#059669]">
                    {formatPeso((selectedClient.trades || []).reduce((acc, t) => acc + (t.commission || 0), 0))}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#059669]">Broker assisted rate (0.25%)</p>
                </div>
                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-3">
                  <p className="text-[10px] font-semibold uppercase text-[#6b7280]">Settlement Status</p>
                  <p className="mt-1 text-sm font-bold text-[#1f2937]">PSE T+2 Standard</p>
                  <p className="mt-0.5 text-[10px] text-[#d97706]">Clearing &amp; custody assured</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#edeef0]">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="border-b border-[#edeef0] bg-[#fafbfc] text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                      <th className="px-3.5 py-2.5">Trade Ref</th>
                      <th className="px-2.5 py-2.5">Side</th>
                      <th className="px-2.5 py-2.5">Security</th>
                      <th className="px-2.5 py-2.5 text-right">Shares</th>
                      <th className="px-2.5 py-2.5 text-right">Fill Price</th>
                      <th className="px-2.5 py-2.5 text-right">Gross Value</th>
                      <th className="px-2.5 py-2.5 text-right">Comm &amp; Fees</th>
                      <th className="px-2.5 py-2.5 text-right">Net Settlement</th>
                      <th className="px-2.5 py-2.5">Settlement</th>
                      <th className="px-2.5 py-2.5">Execution Time</th>
                      <th className="px-2.5 py-2.5">Channel</th>
                      <th className="px-3 py-2.5 text-right">Slip</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2f4f6] text-xs">
                    {(selectedClient.trades || []).map((t) => (
                      <tr key={t.id} className="hover:bg-[#f9fafb] transition">
                        <td className="px-3.5 py-3 font-mono text-[11px] font-bold text-[#334155]">{t.id}</td>
                        <td className="px-2.5 py-3">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                              t.side === 'BUY' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fee2e2] text-[#b91c1c]'
                            }`}
                          >
                            {t.side}
                          </span>
                        </td>
                        <td className="px-2.5 py-3">
                          <span className="font-bold text-[#1e293b]">{t.ticker}</span>
                          <span className="block text-[10px] text-[#8e94a0]">{t.name}</span>
                        </td>
                        <td className="px-2.5 py-3 text-right font-medium text-[#334155]">{t.shares.toLocaleString()}</td>
                        <td className="px-2.5 py-3 text-right font-medium text-[#334155]">₱{t.price.toFixed(2)}</td>
                        <td className="px-2.5 py-3 text-right text-[#475467]">{formatPeso(t.gross)}</td>
                        <td className="px-2.5 py-3 text-right text-[11px] text-[#64748b]">₱{(t.commission + (t.fees || 0)).toFixed(2)}</td>
                        <td className="px-2.5 py-3 text-right font-bold text-[#1e293b]">{formatPeso(t.net)}</td>
                        <td className="px-2.5 py-3">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${
                              t.status === 'SETTLED' ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef3c7] text-[#92400e]'
                            }`}
                          >
                            {t.settlement}
                          </span>
                        </td>
                        <td className="px-2.5 py-3 text-[10px] text-[#8e94a0]">{t.time}</td>
                        <td className="px-2.5 py-3 text-[10px] text-[#64748b]">{t.channel}</td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => triggerToast(`CGSI Confirmation Slip #${t.id}: ${t.side} ${t.shares.toLocaleString()} ${t.ticker} @ ₱${t.price.toFixed(2)} net ${formatPeso(t.net)}`)}
                            className="rounded-lg bg-[#eff6ff] px-2.5 py-1 text-[11px] font-semibold text-[#2563eb] hover:bg-[#dbeafe] transition"
                          >
                            Slip
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Middle Tab 2: Orders (Client Order Book) */}
          {activeTab === 'orders' && (
            <div className="scroll-pane flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold text-[#1f2937]">Client Order Book</h3>
                  <p className="text-[11px] text-[#8e94a0]">
                    Real-time working orders queued for execution on the PSE for {selectedClient.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOrderTicker('SMPH')
                    setOrderPrice(32.50)
                    setOrderShares(1000)
                    setOrderSide('BUY')
                    setOrderModalOpen(true)
                  }}
                  className="flex items-center gap-1 rounded-xl bg-[#2563eb] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#1d4ed8] transition shadow-xs self-start sm:self-auto"
                >
                  <Plus size={14} />
                  <span>+ Place Client Order</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-3">
                  <p className="text-[10px] font-semibold uppercase text-[#6b7280]">Pending Fills</p>
                  <p className="mt-1 text-sm font-bold text-[#d97706]">
                    {selectedClient.orders.filter((o) => o.status === 'PENDING').length} orders
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#6b7280]">Awaiting price match on PSE</p>
                </div>
                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-3">
                  <p className="text-[10px] font-semibold uppercase text-[#6b7280]">Queued Capital</p>
                  <p className="mt-1 text-sm font-bold text-[#1f2937]">
                    {formatPeso(
                      selectedClient.orders
                        .filter((o) => o.status === 'PENDING')
                        .reduce((acc, o) => acc + o.shares * o.price, 0)
                    )}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#2563eb]">Committed order value</p>
                </div>
                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-3">
                  <p className="text-[10px] font-semibold uppercase text-[#6b7280]">Exchange Gateway</p>
                  <p className="mt-1 text-sm font-bold text-[#1f2937]">PSE Direct FIX</p>
                  <p className="mt-0.5 text-[10px] text-[#059669]">Continuous trading session</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#edeef0]">
                <table className="w-full min-w-[640px] text-left">
                  <thead>
                    <tr className="border-b border-[#edeef0] bg-[#fafbfc] text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af]">
                      <th className="px-3.5 py-2.5">Order ID</th>
                      <th className="px-2.5 py-2.5">Side</th>
                      <th className="px-2.5 py-2.5">Ticker</th>
                      <th className="px-2.5 py-2.5 text-right">Quantity</th>
                      <th className="px-2.5 py-2.5 text-right">Price</th>
                      <th className="px-2.5 py-2.5">Type</th>
                      <th className="px-2.5 py-2.5">Status</th>
                      <th className="px-2.5 py-2.5">Timestamp</th>
                      <th className="px-3.5 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2f4f6] text-xs">
                    {selectedClient.orders.map((o) => (
                      <tr
                        key={o.id}
                        className={`transition ${
                          o.id === selectedOrderId
                            ? 'bg-[#eff6ff] ring-1 ring-[#93c5fd]'
                            : 'hover:bg-[#f9fafb]'
                        }`}
                      >
                        <td className="px-3.5 py-3 font-mono text-[11px] font-semibold text-[#475467]">{o.id}</td>
                        <td className="px-2.5 py-3">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                              o.side === 'BUY'
                                ? 'bg-[#dcfce7] text-[#15803d]'
                                : o.side === 'SELL'
                                ? 'bg-[#fee2e2] text-[#b91c1c]'
                                : 'bg-[#e0e7ff] text-[#4338ca]'
                            }`}
                          >
                            {o.side}
                          </span>
                        </td>
                        <td className="px-2.5 py-3 font-bold text-[#1e293b]">{o.ticker}</td>
                        <td className="px-2.5 py-3 text-right font-medium text-[#334155]">{o.shares.toLocaleString()}</td>
                        <td className="px-2.5 py-3 text-right font-medium text-[#334155]">₱{o.price.toFixed(2)}</td>
                        <td className="px-2.5 py-3 text-[#64748b]">{o.type}</td>
                        <td className="px-2.5 py-3">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                              o.status === 'EXECUTED'
                                ? 'bg-[#ecfdf5] text-[#059669]'
                                : o.status === 'PENDING'
                                ? 'bg-[#fef3c7] text-[#92400e]'
                                : 'bg-[#f1f5f9] text-[#64748b]'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="px-2.5 py-3 text-[10px] text-[#8e94a0]">{o.date}</td>
                        <td className="px-3.5 py-3 text-right">
                          {o.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleExecuteOrder(o)}
                                className="rounded-md bg-[#eff6ff] px-2 py-1 text-[11px] font-bold text-[#2563eb] hover:bg-[#dbeafe] transition"
                              >
                                Fill Order
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(o.id)}
                                className="rounded-md bg-[#fef2f2] px-2 py-1 text-[11px] font-semibold text-[#dc2626] hover:bg-[#fee2e2] transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] font-medium text-[#9ca3af]">
                              {o.status === 'EXECUTED' ? '✓ Filled' : 'Cancelled'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Panel 3: Messaging Panel (Right - Similar size to Panel 1, with Historical & Live tabs) */}
        <div className="flex flex-col bg-[#fafbfc]">
          {/* Messaging Panel Header & Tabs */}
          <div className="border-b border-[#edeef0] bg-white p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-[#2563eb]" />
                <h3 className="text-xs font-bold text-[#1e293b]">Client Messages</h3>
              </div>
            </div>

            {/* Search Field */}
            <label className="flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-2.5 py-1.5 text-[#9ca3af] focus-within:border-[#2563eb] focus-within:bg-white transition">
              <Search size={13} />
              <input
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full bg-transparent text-xs text-[#525763] outline-none placeholder:text-[#a7aab0]"
              />
              {messageSearch && (
                <button
                  type="button"
                  onClick={() => setMessageSearch('')}
                  className="text-[#9ca3af] hover:text-[#4b5563]"
                  aria-label="Clear message search"
                >
                  <X size={12} />
                </button>
              )}
            </label>

            {/* Chat Mode Tabs: Today vs Previous */}
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#f2f4f7] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChatMode('live')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] transition ${
                  chatMode === 'live' ? 'bg-white text-[#2563eb] shadow-2xs font-bold' : 'text-[#6b7280] hover:text-[#1f2937]'
                }`}
              >
                <MessageCircle size={12} />
                <span>Today</span>
              </button>
              <button
                type="button"
                onClick={() => setChatMode('historical')}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] transition ${
                  chatMode === 'historical' ? 'bg-white text-[#2563eb] shadow-2xs font-bold' : 'text-[#6b7280] hover:text-[#1f2937]'
                }`}
              >
                <Clock size={12} />
                <span>Previous</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="scroll-pane flex-1 space-y-3 overflow-y-auto p-3.5">
            {(() => {
              const activeMessages = chatMode === 'live'
                ? (selectedClient.messages || [])
                : (selectedClient.previousMessages || [])

              const displayedMessages = messageSearch.trim()
                ? activeMessages.filter(
                    (msg) =>
                      msg.text.toLowerCase().includes(messageSearch.toLowerCase()) ||
                      msg.sender.toLowerCase().includes(messageSearch.toLowerCase())
                  )
                : activeMessages

              if (displayedMessages.length === 0) {
                return (
                  <div className="p-8 text-center text-xs text-[#9ca3af]">
                    {messageSearch
                      ? `No messages match "${messageSearch}"`
                      : chatMode === 'live'
                      ? 'No messages today yet.'
                      : 'No previous conversations recorded.'}
                  </div>
                )
              }

              return displayedMessages.map((msg) => {
                const isAgent = !msg.isClient
                return (
                  <div key={msg.id} className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 text-[9px] text-[#8e94a0] mb-0.5">
                      <span className="font-semibold text-[#4b5563]">{isAgent ? 'You (Agent)' : msg.sender}</span>
                      <span>·</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`max-w-[88%] rounded-2xl p-2.5 text-xs leading-relaxed ${
                        isAgent ? 'bg-[#2563eb] text-white rounded-tr-xs' : 'bg-white border border-[#e5e7eb] text-[#333b49] rounded-tl-xs shadow-2xs'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                )
              })
            })()}
          </div>

          {/* Quick Reply Suggestions */}
          {chatMode === 'live' && (
            <div className="border-t border-[#edeef0] bg-white px-3 py-1.5 flex items-center gap-1 overflow-x-auto text-[10px] scroll-pane">
              {[
                'Execution confirmed on PSE.',
                'Sending dividend forecast.',
                'PERA tax deduction applied.',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setReplyText(chip)}
                  className="shrink-0 rounded-lg border border-[#e0e4ec] bg-[#f8f9fa] px-2 py-0.5 text-[#475467] transition hover:border-[#2563eb] hover:bg-white hover:text-[#2563eb]"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-1.5 border-t border-[#edeef0] bg-white p-2.5">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={chatMode === 'live' ? `Reply to ${selectedClient.name}...` : 'Send a message...'}
              className="min-w-0 flex-1 rounded-xl bg-[#f5f6f7] px-3 py-2 text-xs text-[#374151] outline-none placeholder:text-[#a0a5ad]"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#2563eb] text-white transition hover:bg-[#1d4ed8]"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </Card>

      {/* Place Order Modal */}
      {orderModalOpen && (
        <Modal title={`Place Order · ${selectedClient.name}`} onClose={() => setOrderModalOpen(false)}>
          <form onSubmit={handlePlaceOrder} className="mt-3 space-y-4">
            <div className="rounded-xl bg-[#f8f9fb] p-3 border border-[#e5e7eb] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#8e94a0]">Client Account:</span>{' '}
                <span className="font-semibold text-[#1e293b]">{selectedClient.name} ({selectedClient.accountNumber})</span>
              </div>
              <span className="font-bold text-[#059669]">{formatPeso(selectedClient.cash)} Cash</span>
            </div>

            {/* Side: Buy / Sell */}
            <div>
              <label className="block text-[11px] font-semibold text-[#475467] mb-1.5">Order Side</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderSide('BUY')}
                  className={`rounded-xl py-2 text-xs font-bold transition ${orderSide === 'BUY' ? 'bg-[#15803d] text-white shadow-xs' : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]'}`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setOrderSide('SELL')}
                  className={`rounded-xl py-2 text-xs font-bold transition ${orderSide === 'SELL' ? 'bg-[#b91c1c] text-white shadow-xs' : 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]'}`}
                >
                  SELL
                </button>
              </div>
            </div>

            {/* Ticker & Shares */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#475467] mb-1">PSE Ticker Symbol</label>
                <select
                  value={orderTicker}
                  onChange={(e) => {
                    const sym = e.target.value
                    setOrderTicker(sym)
                    if (sym === 'SMPH') setOrderPrice(32.80)
                    if (sym === 'BDO') setOrderPrice(154.50)
                    if (sym === 'ALI') setOrderPrice(34.20)
                    if (sym === 'FMETF') setOrderPrice(108.50)
                    if (sym === 'AC') setOrderPrice(642.00)
                    if (sym === 'ICT') setOrderPrice(307.00)
                    if (sym === 'NVDA') setOrderPrice(560.00)
                    if (sym === 'BND') setOrderPrice(53.20)
                  }}
                  className="w-full rounded-xl border border-[#d2d6df] bg-white px-3 py-2 text-xs font-semibold text-[#1e293b] outline-none focus:border-[#2563eb]"
                >
                  <option value="SMPH">SMPH · SM Prime Holdings</option>
                  <option value="BDO">BDO · BDO Unibank</option>
                  <option value="ALI">ALI · Ayala Land Inc.</option>
                  <option value="FMETF">FMETF · First Metro ETF</option>
                  <option value="AC">AC · Ayala Corporation</option>
                  <option value="ICT">ICT · International Container</option>
                  <option value="NVDA">NVDA · Nvidia Corp CDR</option>
                  <option value="BND">BND · Total Bond Fund</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475467] mb-1">Quantity (Shares)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={orderShares}
                  onChange={(e) => setOrderShares(e.target.value)}
                  className="w-full rounded-xl border border-[#d2d6df] bg-white px-3 py-2 text-xs font-semibold text-[#1e293b] outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            {/* Order Type & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#475467] mb-1">Order Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full rounded-xl border border-[#d2d6df] bg-white px-3 py-2 text-xs font-semibold text-[#1e293b] outline-none focus:border-[#2563eb]"
                >
                  <option value="LIMIT">Limit Order</option>
                  <option value="MARKET">Market Order</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#475467] mb-1">Execution Price (₱)</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.05"
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(e.target.value)}
                  className="w-full rounded-xl border border-[#d2d6df] bg-white px-3 py-2 text-xs font-semibold text-[#1e293b] outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            {/* Estimated Total */}
            <div className="rounded-xl border border-[#e5e7eb] bg-[#f8f9fb] p-3 flex items-center justify-between">
              <span className="text-xs text-[#64748b]">Estimated Order Value</span>
              <span className="text-sm font-bold text-[#1e293b]">
                {formatPeso(Number(orderShares || 0) * Number(orderPrice || 0))}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="rounded-xl border border-[#d2d6df] px-4 py-2 text-xs font-semibold text-[#525866] hover:bg-[#f6f7f9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#2563eb] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8]"
              >
                Submit Order to PSE
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function AnnouncementBanner() {
  const [visible, setVisible] = useState(true)
  const [showModal, setShowModal] = useState(false)

  if (!visible) return null

  return (
    <>
      <aside
        aria-label="Important announcement"
        className="mb-4 flex min-h-10 items-center justify-between gap-3 rounded-xl border border-[#dbe3f0] bg-[#f0f4fc] px-3.5 py-2 text-xs text-[#31394a] shadow-xs sm:mb-5 sm:px-4"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#2563eb] text-white shadow-2xs">
            <Sparkles size={13} strokeWidth={2.2} />
          </span>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="rounded-md border border-[#d0dcf5] bg-white/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1e40af]">
              Announcement
            </span>
            <span className="truncate font-semibold text-[#222938]">
              Updated 2026 PSE continuous trading schedule &amp; PERA contribution guidelines
            </span>
            <span className="hidden text-[#657085] xl:inline">
              — Personal Equity maximum tax-credit limits are now in effect.
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-lg px-2 py-1 text-[11px] font-semibold text-[#2563eb] transition hover:bg-[#e2ecfd]"
          >
            Details
          </button>
          <span className="h-3.5 w-px bg-[#d5deed]" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss announcement"
            className="flex size-6 items-center justify-center rounded-lg text-[#7c8698] transition hover:bg-[#e2ecfd] hover:text-[#202738]"
          >
            <X size={14} strokeWidth={2.2} />
          </button>
        </div>
      </aside>

      {showModal && (
        <Modal title="2026 Market & PERA Contribution Guidelines" onClose={() => setShowModal(false)}>
          <div className="mt-2 space-y-3.5 text-xs leading-relaxed text-[#525a6b]">
            <div className="rounded-xl border border-[#e4e9f3] bg-[#f5f7fb] p-3">
              <p className="text-sm font-semibold text-[#1e293b]">Philippine Stock Exchange (PSE) Schedule</p>
              <p className="mt-1 text-[#64748b]">Continuous trading sessions run Monday to Friday from 9:30 AM to 3:00 PM PHT. Pre-open starts at 9:00 AM.</p>
            </div>
            <div className="rounded-xl border border-[#e4e9f3] bg-[#f5f7fb] p-3">
              <p className="text-sm font-semibold text-[#1e293b]">PERA Tax-Exempt Contribution Limits</p>
              <p className="mt-1 text-[#64748b]">Under Republic Act No. 9505, annual contributions up to ₱200,000 for local residents (₱400,000 for Overseas Filipino Workers) qualify for a 5% income tax credit and tax-free investment earnings upon retirement.</p>
            </div>
            <div className="rounded-xl border border-[#e4e9f3] bg-[#f5f7fb] p-3">
              <p className="text-sm font-semibold text-[#1e293b]">Zero Custody Surcharges</p>
              <p className="mt-1 text-[#64748b]">Caballes-Go Securities charges zero custody maintenance fees for all verified PERA and non-PERA retail portfolios.</p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Got it
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem('morrow-theme') === 'night')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const isClientsPage = location.pathname.startsWith('/clients')

  useEffect(() => {
    window.localStorage.setItem('morrow-theme', darkMode ? 'night' : 'day')
  }, [darkMode])

  return (
    <div data-theme={darkMode ? 'night' : 'day'} className="min-h-screen bg-[#f7f8f9] text-[#333946] transition-colors duration-200">
      <div className="flex min-h-screen w-full bg-white xl:h-screen xl:overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)} isTraderView={isClientsPage} />
        <main className="flex min-w-0 flex-1 flex-col bg-[#fbfbfc] xl:h-screen xl:min-h-0 xl:overflow-hidden">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} isTraderView={isClientsPage} />
          <MobileNavigation isTraderView={isClientsPage} />
          <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9 xl:min-h-0 xl:overflow-hidden">
            <div className={`grid w-full items-start gap-6 xl:h-full xl:min-h-0 ${isClientsPage ? 'grid-cols-1' : 'xl:grid-cols-[minmax(0,1fr)_280px]'} xl:grid-rows-1 xl:items-stretch 2xl:gap-8`}>
              <div className="min-w-0 scroll-pane xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-2">
                {!isClientsPage && <AnnouncementBanner />}
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/funding" element={<FundingPage />} />
                  <Route path="/learn" element={<LearnPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/terms-of-service" element={<PolicyPage title="Terms of Service" documentName="Terms of Service" />} />
                  <Route path="/privacy-policy" element={<PolicyPage title="Privacy Policy" documentName="Privacy Policy" />} />
                  <Route path="/sign-out" element={<SignOutPage />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </div>
              {!isClientsPage && <CommunityRightRail />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
