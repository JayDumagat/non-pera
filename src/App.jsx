import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, NavLink as RouterNavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock,
  ExternalLink,
  FileText,
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
  WalletCards,
} from 'lucide-react'

const navigationSections = [
  { label: 'Overview', items: [{ id: 'home', label: 'Home', icon: 'home' }] },
  { label: 'Invest', items: [
    { id: 'portfolio', label: 'Portfolio', icon: 'portfolio' },
    { id: 'products', label: 'Products', icon: 'products' },
    { id: 'funding', label: 'Funding', icon: 'funding' },
  ] },
  { label: 'Discover', items: [{ id: 'learn', label: 'Learn', icon: 'learn', badge: '2' }] },
  { label: 'Account', items: [
    { id: 'messages', label: 'Messages', icon: 'messages', unread: true },
    { id: 'profile', label: 'Profile', icon: 'profile' },
  ] },
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
  { id: 'treasury', symbol: '▤', name: 'Treasury Portfolio', category: 'Fixed income', detail: 'A steadier mix of government bonds', minimum: '₱100', fee: '0.12%', risk: 'Low', tint: 'sand', return: '+4.2%' },
  { id: 'cash', symbol: '◌', name: 'Cash Reserve', category: 'Cash', detail: 'Keep funds available for your next move', minimum: '₱1', fee: 'No fee', risk: 'Low', tint: 'lavender', return: '4.1% APY' },
  { id: 'retirement', symbol: '↗', name: 'Future Builder', category: 'Retirement', detail: 'A diversified long-term portfolio', minimum: '₱25', fee: '0.18%', risk: 'Balanced', tint: 'rose', return: '+6.8%' },
  { id: 'green', symbol: '✳', name: 'Sustainable Leaders', category: 'Index funds', detail: 'Companies screened for sustainability', minimum: '₱10', fee: '0.15%', risk: 'Moderate', tint: 'sage', return: '+6.2%' },
]

const activities = [
  { title: 'Recurring investment', detail: 'Total Market ETF · Today, 9:42 AM', amount: '-₱150.00', kind: 'invest' },
  { title: 'Dividend received', detail: 'International ETF · Oct 12, 2026', amount: '+₱18.24', kind: 'income' },
  { title: 'Deposit completed', detail: 'Bank transfer · Oct 10, 2026', amount: '+₱500.00', kind: 'deposit' },
]

const rangeReturns = { '1W': '+1.24%', '1M': '+5.49%', '3M': '+8.16%', '1Y': '+12.38%', ALL: '+18.62%' }

const portfolioCategories = [
  { id: 'overall', label: 'Overall', value: 24680.5, change: '+5.49%', changeAmount: 1284.2 },
  { id: 'equities', label: 'Equities', value: 17240, change: '+6.21%', changeAmount: 1008.4 },
  { id: 'uitfs', label: 'UITFs', value: 3480.5, change: '+3.71%', changeAmount: 124.5 },
  { id: 'mutual-fund', label: 'Mutual fund', value: 2760, change: '+4.52%', changeAmount: 119.3 },
  { id: 'others', label: 'Others', value: 1200, change: '+2.74%', changeAmount: 32 },
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
  { id: 'account-1', category: 'equities', name: 'Account 1', accountNumber: '•••• 1842', value: 9422.16, monthlyReturn: 5.2, color: '#2563eb' },
  { id: 'account-2', category: 'equities', name: 'Account 2', accountNumber: '•••• 2957', value: 6218.4, monthlyReturn: 4.4, color: '#0f9f83' },
  { id: 'account-3', category: 'equities', name: 'Account 3', accountNumber: '•••• 4038', value: 1599.44, monthlyReturn: 7.6, color: '#8b5cf6' },
  { id: 'account-4', category: 'uitfs', name: 'Account 4', accountNumber: '•••• 5174', value: 2180.5, monthlyReturn: 3.8, color: '#0891b2' },
  { id: 'account-5', category: 'uitfs', name: 'Account 5', accountNumber: '•••• 6281', value: 1300, monthlyReturn: 2.4, color: '#14b8a6' },
  { id: 'account-6', category: 'mutual-fund', name: 'Account 6', accountNumber: '•••• 7390', value: 1680, monthlyReturn: 4.1, color: '#d97706' },
  { id: 'account-7', category: 'mutual-fund', name: 'Account 7', accountNumber: '•••• 8426', value: 1080, monthlyReturn: 5.6, color: '#db2777' },
  { id: 'account-8', category: 'others', name: 'Account 8', accountNumber: '•••• 9513', value: 900, monthlyReturn: 1.1, color: '#64748b' },
  { id: 'account-9', category: 'others', name: 'Account 9', accountNumber: '•••• 0674', value: 300, monthlyReturn: 2.2, color: '#7c3aed' },
]

const categoryBenchmarks = {
  overall: { name: 'Philippine market blend', monthlyReturn: 3.4, color: '#818a9b' },
  equities: { name: 'PSEi index', monthlyReturn: 4.2, color: '#818a9b' },
  uitfs: { name: 'UITF market benchmark', monthlyReturn: 2.8, color: '#818a9b' },
  'mutual-fund': { name: 'Mutual fund benchmark', monthlyReturn: 3.3, color: '#818a9b' },
  others: { name: 'Fixed income benchmark', monthlyReturn: 1.6, color: '#818a9b' },
}

function formatReturn(value) {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
}

function getCategoryAccounts(category) {
  return category === 'overall' ? investmentAccounts : investmentAccounts.filter((account) => account.category === category)
}

function getCategoryChartSeries(category, selectedAccountId = null) {
  const selectedAccount = investmentAccounts.find((account) => account.id === selectedAccountId)
  const chartCategory = selectedAccount?.category || category
  const benchmark = categoryBenchmarks[chartCategory] || categoryBenchmarks.overall
  const accounts = chartCategory === 'overall' ? [] : getCategoryAccounts(chartCategory)
  const portfolioSeries = selectedAccount
    ? [{ id: selectedAccount.id, name: selectedAccount.name, monthlyReturn: selectedAccount.monthlyReturn, color: selectedAccount.color }]
    : chartCategory === 'overall'
      ? [{ id: 'portfolio', name: 'Total portfolio', monthlyReturn: Number(portfolioCategories[0].change.replace('%', '').replace('+', '')), color: '#2563eb' }]
      : accounts.map((account) => ({ id: account.id, name: account.name, monthlyReturn: account.monthlyReturn, color: account.color }))

  return [...portfolioSeries, { id: 'benchmark', name: benchmark.name, monthlyReturn: benchmark.monthlyReturn, color: benchmark.color, benchmark: true }]
}

function getCategoryPerformanceData(category, range, selectedAccountId = null) {
  const selectedAccount = investmentAccounts.find((account) => account.id === selectedAccountId)
  const chartCategory = selectedAccount?.category || category
  const activeCategory = portfolioCategories.find((item) => item.id === chartCategory) || portfolioCategories[0]
  const series = getCategoryChartSeries(activeCategory.id, selectedAccountId)
  const trendData = getTrendData(activeCategory.id, range)
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

function getTrendData(category, range) {
  const activeCategory = portfolioCategories.find((item) => item.id === category) || portfolioCategories[0]
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
  return (
    <RouterNavLink
      to={`/${item.id}`}
      end
      aria-label={compact ? item.label : undefined}
      title={compact ? item.label : undefined}
      className={({ isActive }) => `group relative flex items-center rounded-xl py-2.5 text-left text-[14px] font-medium transition ${mobile ? 'shrink-0 gap-3 px-3' : compact ? 'w-full justify-center px-0' : 'w-full gap-3 px-3'} ${item.danger ? 'text-[#b86a62] hover:bg-[#fff2f0] hover:text-[#a94f48]' : isActive ? 'bg-[#eff6ff] text-[#1d4ed8]' : 'text-[#757982] hover:bg-[#f3f4f6] hover:text-[#2563eb]'}`}
    >
      {({ isActive }) => <>
        <Icon name={item.icon} size={19} className={item.danger ? 'text-[#b86a62]' : isActive ? 'text-[#2563eb]' : 'text-[#9397a0] group-hover:text-[#2563eb]'} />
        {!compact && <span>{item.label}</span>}
        {item.badge && <span className={compact ? 'absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#f3e8d9] text-[8px] font-bold text-[#a87543]' : 'ml-auto rounded-full bg-[#f3e8d9] px-1.5 py-0.5 text-[9px] font-bold text-[#a87543]'}>{item.badge}</span>}
        {item.unread && <span className={compact ? 'absolute right-1 top-1 size-2 rounded-full bg-[#cc8a52]' : 'ml-auto size-2 rounded-full bg-[#cc8a52]'} />}
      </>}
    </RouterNavLink>
  )
}

function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`scroll-pane relative hidden shrink-0 flex-col overflow-y-auto border-r border-[#e8e9ec] bg-white py-7 transition-[width,padding] duration-200 lg:flex ${collapsed ? 'w-[76px] px-2' : 'w-[248px] px-5'}`}>
      <div className={`mb-10 px-1 ${collapsed ? 'flex justify-center' : 'flex'}`}>
        <Brand compact={collapsed} />
      </div>
      <button type="button" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed} aria-controls="primary-navigation" title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={onToggle} className="absolute -right-[18px] top-7 z-30 flex size-9 items-center justify-center rounded-full border border-[#e8e9ec] bg-white text-[#717580] shadow-sm transition hover:text-[#2563eb]">
        <Icon name={collapsed ? 'expand' : 'collapse'} size={18} />
      </button>
      <nav id="primary-navigation" className={`flex flex-col ${collapsed ? 'gap-4' : 'gap-6'}`} aria-label="Main navigation">
        {navigationSections.map((section) => <div key={section.label} className={collapsed ? 'border-t border-[#edeef0] pt-3 first:border-0 first:pt-0' : ''}>
          {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#a1a4aa]">{section.label}</p>}
          <div className="flex flex-col gap-1">{section.items.map((item) => <SidebarLink key={item.id} item={item} collapsed={collapsed} />)}</div>
        </div>)}
      </nav>
      <div className="mt-auto">
        {collapsed ? <div className="mb-1 flex justify-center rounded-xl bg-[#f3f5f7] p-3" title="Demo account" aria-label="Demo account"><span className="size-2 rounded-full bg-[#7b88a3]" /></div> : <div className="rounded-2xl bg-[#f3f5f7] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#586071]"><span className="size-1.5 rounded-full bg-[#7b88a3]" />Demo account</div>
          <p className="text-xs leading-5 text-[#848891]">Explore the experience with sample data. No real transactions are made.</p>
        </div>}
        <RouterNavLink to="/profile" aria-label={collapsed ? 'Alex Johnson, Balanced risk profile' : undefined} title={collapsed ? 'Alex Johnson' : undefined} className={`mt-5 flex rounded-xl p-2 text-left hover:bg-[#f5f6f8] ${collapsed ? 'justify-center' : 'items-center gap-3'}`}>
          {!collapsed && <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#343946]">Alex Johnson</span><span className="block text-xs text-[#989ba1]">Balanced risk profile</span></span>}
          <Avatar />
        </RouterNavLink>
        <nav aria-label="Settings and help" className={`mt-3 flex flex-col gap-1 border-t border-[#edeef0] pt-3 ${collapsed ? 'items-center' : ''}`}>
          {sidebarUtilityLinks.map((item) => <SidebarLink key={item.id} item={item} collapsed={collapsed} />)}
        </nav>
      </div>
    </aside>
  )
}

function Header({ darkMode, setDarkMode }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  return (
    <header className="relative z-20 flex items-center justify-between gap-3 border-b border-[#e8e9ec] bg-white px-4 py-3 sm:px-8 lg:px-10 lg:py-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#333948] sm:text-base">{greeting}, Alex</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button type="button" aria-label={darkMode ? 'Switch to day mode' : 'Switch to night mode'} aria-pressed={darkMode} onClick={() => setDarkMode(!darkMode)} className="flex size-9 items-center justify-center rounded-xl text-[#717580] transition hover:bg-[#f2f3f5] hover:text-[#2563eb] sm:size-10">
          <Icon name={darkMode ? 'sun' : 'moon'} size={19} />
        </button>
        <div className="relative">
          <button type="button" aria-label="Notifications" aria-expanded={notificationsOpen} onClick={() => { setNotificationsOpen(!notificationsOpen); setUserOpen(false) }} className="relative flex size-9 items-center justify-center rounded-xl text-[#717580] transition hover:bg-[#f2f3f5] hover:text-[#2563eb] sm:size-10">
            <Icon name="bell" size={19} /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-[#cb8750]" />
          </button>
          {notificationsOpen && <div className="absolute right-0 top-full mt-3 w-[290px] overflow-hidden rounded-2xl border border-[#e7e9ec] bg-white shadow-xl sm:w-[330px]" role="menu" aria-label="Notifications">
            <div className="flex items-center justify-between border-b border-[#edeef0] px-4 py-3"><div><p className="text-sm font-semibold text-[#3d4351]">Notifications</p><p className="mt-0.5 text-[10px] text-[#999da4]">You have 2 new updates</p></div><span className="rounded-full bg-[#f5ebdf] px-2 py-1 text-[9px] font-bold text-[#a87543]">2 new</span></div>
            <button type="button" onClick={() => { navigate('/learn'); setNotificationsOpen(false) }} className="flex w-full gap-3 border-b border-[#f0f1f2] p-4 text-left hover:bg-[#f8f9fa]"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#edf0f4] text-[#5f6d8a]"><Icon name="learn" size={17} /></span><span><span className="block text-xs font-semibold text-[#464c59]">New in Learn</span><span className="mt-1 block text-[10px] leading-4 text-[#92969e]">Two new guides are ready for you.</span><span className="mt-1 block text-[9px] text-[#a1a4aa]">Today</span></span></button>
            <button type="button" onClick={() => { navigate('/portfolio'); setNotificationsOpen(false) }} className="flex w-full gap-3 p-4 text-left hover:bg-[#f8f9fa]"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f5f1e9] text-[#aa8354]"><Icon name="portfolio" size={17} /></span><span><span className="block text-xs font-semibold text-[#464c59]">Your weekly summary</span><span className="mt-1 block text-[10px] leading-4 text-[#92969e]">Your portfolio is up 1.2% this week.</span><span className="mt-1 block text-[9px] text-[#a1a4aa]">Yesterday</span></span></button>
          </div>}
        </div>
        <span aria-hidden="true" className="mx-2 h-7 w-px bg-[#e2e4e8] sm:mx-3" />
        <div className="relative">
          <button type="button" aria-label="Open user menu" aria-expanded={userOpen} onClick={() => { setUserOpen(!userOpen); setNotificationsOpen(false) }} className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-[#f5f6f7] sm:gap-3 sm:pr-2">
            <span className="hidden min-w-0 text-left sm:block"><span className="block max-w-32 truncate text-xs font-semibold text-[#404653]">Alex Johnson</span><span className="mt-1 block text-[10px] text-[#8f939b]">Balanced risk profile</span></span>
            <Avatar className="size-9 sm:size-10" iconSize={19} />
          </button>
          {userOpen && <div className="absolute right-0 top-full mt-3 w-[260px] rounded-2xl border border-[#e7e9ec] bg-white p-2 shadow-xl" role="menu" aria-label="User menu">
            <div className="flex items-center justify-between gap-3 border-b border-[#edeef0] px-3 py-3"><span><span className="block text-xs font-semibold text-[#404653]">Alex Johnson</span><span className="mt-1 block text-[10px] text-[#4f596c]">Balanced risk profile</span><span className="mt-1 block text-[10px] text-[#8f939b]">alex.johnson@example.com</span></span><Avatar className="size-10" /></div>
            <button type="button" onClick={() => { navigate('/profile'); setUserOpen(false) }} className="w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#5d626c] hover:bg-[#f5f6f7]">Profile and preferences</button>
          </div>}
        </div>
      </div>
    </header>
  )
}

function MobileNavigation() {
  return <nav className="flex gap-1 overflow-x-auto border-b border-[#e8e9ec] bg-white px-3 py-2 lg:hidden" aria-label="Main navigation">{navigation.map((item) => <SidebarLink key={item.id} item={item} mobile />)}</nav>
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

function CategoryTrendChart({ range, setRange, category, selectedAccountId }) {
  const categoryData = portfolioCategories.find((item) => item.id === category) || portfolioCategories[0]
  const selectedAccount = investmentAccounts.find((account) => account.id === selectedAccountId)
  const chartCategory = selectedAccount?.category || categoryData.id
  const benchmark = categoryBenchmarks[chartCategory] || categoryBenchmarks.overall
  const series = getCategoryChartSeries(categoryData.id, selectedAccountId)
  const data = useMemo(() => getCategoryPerformanceData(categoryData.id, range, selectedAccountId), [categoryData.id, range, selectedAccountId])
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

function CategoryAccountsList({ category, range, selectedAccountId, onSelectAccount }) {
  const categoryData = portfolioCategories.find((item) => item.id === category) || portfolioCategories[0]
  const accounts = getCategoryAccounts(categoryData.id)
  const multiplier = rangeReturnMultipliers[range]
  const scrollRef = useRef(null)

  const scrollAccounts = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 280, behavior: 'smooth' })
  }

  return (
    <section aria-label={`${categoryData.label} accounts`}>
      <div className="flex items-center justify-between gap-3">
        <div><h3 className="text-sm font-semibold text-[#343a48]">{categoryData.id === 'overall' ? 'All investment accounts' : `${categoryData.label} accounts`}</h3><p className="mt-1 text-xs text-[#989ca4]">{accounts.length} accounts · Select one to compare with its benchmark</p></div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={() => scrollAccounts(-1)} aria-label="Scroll accounts left" className="flex size-9 items-center justify-center rounded-full border border-[#e7e9ed] text-[#687184] transition hover:bg-[#f5f7fa] hover:text-[#2563eb]"><ChevronLeft size={17} /></button>
          <button type="button" onClick={() => scrollAccounts(1)} aria-label="Scroll accounts right" className="flex size-9 items-center justify-center rounded-full border border-[#e7e9ed] text-[#687184] transition hover:bg-[#f5f7fa] hover:text-[#2563eb]"><ChevronRight size={17} /></button>
        </div>
      </div>
      <div ref={scrollRef} className="scroll-pane mt-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth pb-1" aria-label="Scrollable investment accounts">
        {accounts.map((account) => <button key={account.id} type="button" aria-pressed={selectedAccountId === account.id} onClick={() => onSelectAccount(selectedAccountId === account.id ? null : account.id)} className={`w-[190px] shrink-0 snap-start rounded-xl border p-2.5 text-left transition ${selectedAccountId === account.id ? 'border-[#7aa8ff] bg-[#f2f7ff] shadow-[0_0_0_1px_rgba(59,130,246,0.12)]' : 'border-[#e9ebef] bg-white hover:border-[#c8d9f7] hover:bg-[#fbfdff]'}`}>
          <span className="flex items-center gap-2"><span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: account.color }} /><span className="min-w-0"><span className="block truncate text-[11px] font-semibold text-[#454b58]">{account.name}</span><span className="mt-0.5 block truncate text-[9px] text-[#989da7]">Acct. {account.accountNumber}</span></span></span>
          <span className="mt-2 block text-[13px] font-semibold tracking-tight text-[#343a48]">{formatPeso(account.value)}</span>
          <span className="mt-1 flex items-center justify-between gap-2"><span className="text-[9px] text-[#9399a5]">{range} return</span><span className="text-[10px] font-semibold text-[#2563eb]">{formatReturn(account.monthlyReturn * multiplier)}</span></span>
        </button>)}
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

function PortfolioValueCard({ range, setRange, selectedCategory, setSelectedCategory, selectedAccountId, setSelectedAccountId }) {
  const selectedData = portfolioCategories.find((item) => item.id === selectedCategory)

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-stretch">
        <Card className="min-w-0 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-xs font-medium text-[#969aa1]">Total portfolio value</p>
              <p className="mt-2 text-[30px] font-semibold tracking-tight text-[#343a48] sm:text-[34px]">{formatPeso(24680.5)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1"><Change value={portfolioCategories[0].change} /><span className="text-[11px] font-medium text-[#7e8490]">+{formatPeso(portfolioCategories[0].changeAmount)} this month</span></div>
            </div>
            {selectedCategory !== 'overall' && <div className="ml-auto text-right">
              <p className="text-xs font-medium text-[#969aa1]">{selectedData.label} value</p>
              <p className="mt-2 text-[30px] font-semibold tracking-tight text-[#343a48] sm:text-[34px]">{formatPeso(selectedData.value)}</p>
              <div className="mt-2 flex flex-wrap items-center justify-end gap-x-4 gap-y-1"><Change value={selectedData.change} /><span className="text-[11px] font-medium text-[#7e8490]">+{formatPeso(selectedData.changeAmount)} this month</span></div>
            </div>}
          </div>
          <div className="mt-6 min-w-0">
            <CategoryTrendChart range={range} setRange={setRange} category={selectedCategory} selectedAccountId={selectedAccountId} />
          </div>
        </Card>

        <Card className="flex min-h-[360px] flex-col p-4 sm:p-5">
          <h3 className="mb-3 text-xs font-semibold text-[#555c6a]">Categories</h3>
          <div role="tablist" aria-label="Portfolio categories" className="scroll-pane min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain">
            {portfolioCategories.map((category) => <button key={category.id} type="button" role="tab" aria-selected={selectedCategory === category.id} onClick={() => { setSelectedCategory(category.id); setSelectedAccountId(null) }} className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-3 text-left transition ${selectedCategory === category.id ? 'bg-[#eff5ff] text-[#2563eb]' : 'text-[#777f8d] hover:bg-[#f8f9fb] hover:text-[#46536d]'}`}>
              <span className="min-w-0"><span className="block truncate text-[11px] font-semibold">{category.label}</span><span className="mt-1 block text-[9px] text-[#969ca7]">{formatPeso(category.value)}</span></span>
              {selectedCategory === category.id && <span className="size-1.5 shrink-0 rounded-full bg-[#3b82f6]" />}
            </button>)}
          </div>
        </Card>
      </div>
    <CategoryAccountsList category={selectedCategory} range={range} selectedAccountId={selectedAccountId} onSelectAccount={setSelectedAccountId} />
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
      <div className="flex items-start justify-between"><span className={`flex size-11 items-center justify-center rounded-[14px] text-xl ${tints[product.tint]}`}>{product.symbol}</span><span className="rounded-full bg-[#f5f6f7] px-2.5 py-1 text-[10px] font-medium text-[#828690]">{product.category}</span></div>
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
      <div className="mb-5 flex items-center justify-between"><p className="text-xs text-[#999ca3]">{filtered.length} options to explore</p><span className="text-[10px] text-[#a7aaaf]">Returns shown are illustrative</span></div>
      {filtered.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} onExplore={setSelectedProduct} />)}</div> : <Card className="p-12 text-center"><p className="text-sm font-medium text-[#666b76]">No matching products</p><p className="mt-1 text-xs text-[#9a9da4]">Try a different search or category.</p></Card>}
      {selectedProduct && <Modal title={selectedProduct.name} onClose={() => setSelectedProduct(null)}><p className="text-sm leading-6 text-[#7f838d]">{selectedProduct.detail}. This sample product page is for exploring the experience. Product details and performance shown here are illustrative.</p><div className="mt-5 rounded-xl bg-[#f5f6f8] p-4"><p className="text-xs text-[#9397a0]">Minimum investment</p><p className="mt-1 font-semibold text-[#404656]">{selectedProduct.minimum}</p></div><button onClick={() => { setSelectedProduct(null); navigate('/funding') }} type="button" className="mt-6 w-full rounded-xl bg-[#2563eb] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1d4ed8]">Continue to funding</button></Modal>}
    </div>
  )
}

function FundingPage() {
  const [mode, setMode] = useState('Add money')
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bank')
  const [notice, setNotice] = useState('')
  const methods = [{ id: 'bank', name: 'Bank transfer', detail: '1–3 business days', mark: 'BK' }, { id: 'debit', name: 'Debit card', detail: 'Usually instant', mark: '••' }]
  function handleSubmit(event) {
    event.preventDefault()
    if (!amount || Number(amount) <= 0) {
      setNotice('Enter an amount greater than ₱0 to continue.')
      return
    }
    setNotice(`${mode} request for ${formatPeso(Number(amount))} is ready in this demo.`)
  }
  return (
    <div>
      <PageIntro title="Move money" subtitle="Add funds or transfer money out of your account." />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
        <Card className="p-5 sm:p-7">
          <div className="mb-7 flex rounded-xl bg-[#f2f3f5] p-1">{['Add money', 'Withdraw'].map((item) => <button key={item} onClick={() => { setMode(item); setNotice('') }} type="button" className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${mode === item ? 'bg-white text-[#3b455b] shadow-sm' : 'text-[#92969d]'}`}>{item}</button>)}</div>
          <form onSubmit={handleSubmit}>
            <label className="block text-xs font-semibold text-[#595e6a]" htmlFor="amount">{mode === 'Add money' ? 'How much would you like to add?' : 'How much would you like to withdraw?'}</label>
            <div className="mt-3 flex items-center rounded-xl border border-[#e4e6ea] px-4 py-4 focus-within:border-[#828da4]"><span className="mr-2 text-xl text-[#9a9ea5]">₱</span><input id="amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" className="w-full bg-transparent text-2xl font-semibold tracking-tight text-[#393f4e] outline-none placeholder:text-[#c1c4c9]" /><span className="text-xs text-[#9b9fa6]">PHP</span></div>
            <p className="mt-2 text-[10px] text-[#9da0a7]">{mode === 'Add money' ? `Available balance: ${formatPeso(3260.5)}` : `Withdrawable balance: ${formatPeso(3260.5)}`}</p>
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

function App() {
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem('morrow-theme') === 'night')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    window.localStorage.setItem('morrow-theme', darkMode ? 'night' : 'day')
  }, [darkMode])

  return (
    <div data-theme={darkMode ? 'night' : 'day'} className="min-h-screen bg-[#f7f8f9] text-[#333946] transition-colors duration-200">
      <div className="flex min-h-screen w-full bg-white xl:h-screen xl:overflow-hidden">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)} />
        <main className="flex min-w-0 flex-1 flex-col bg-[#fbfbfc] xl:h-screen xl:min-h-0 xl:overflow-hidden">
          <Header darkMode={darkMode} setDarkMode={setDarkMode} />
          <MobileNavigation />
          <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9 xl:min-h-0 xl:overflow-hidden">
            <div className="grid w-full items-start gap-6 xl:h-full xl:min-h-0 xl:grid-cols-[minmax(0,1fr)_280px] xl:grid-rows-1 xl:items-stretch 2xl:gap-8">
              <div className="min-w-0 scroll-pane xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain xl:pr-2">
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/home" element={<HomePage />} />
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
              <CommunityRightRail />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
