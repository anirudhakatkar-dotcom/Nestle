import { useState, useEffect } from 'react'
import Login     from './pages/Login'
import Inventory from './pages/Inventory'
import Meals     from './pages/Meals'
import Watchlist from './pages/Watchlist'
import BottomNav from './components/BottomNav'
import { T } from './tokens'

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [tab,    setTab]    = useState('inventory')

  useEffect(() => {
    if (sessionStorage.getItem('nestle_auth') === '1') setAuthed(true)
  }, [])

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: T.bg, position: 'relative' }}>
      {tab === 'inventory' && <Inventory />}
      {tab === 'meals'     && <Meals />}
      {tab === 'watchlist' && <Watchlist />}
      <BottomNav active={tab} set={setTab} />
    </div>
  )
}
