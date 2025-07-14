import { Route, Routes } from 'react-router'
import './styles/App.css'
import Loginoverview from './components/login/Loginoverview'
import LoginWithBadge from './components/login/LoginWithBadge'
import LoginWithEmailAndPassword from './components/login/LoginWithEmailAndPassword'
import LoginAsGuest from './components/login/LoginAsGuest'
import Start from './components/Start'
import Gameoverview from './components/Gamesoverview'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login-overview' element={<Loginoverview />} />
        <Route path='/login-with-badge' element={<LoginWithBadge />} />
        <Route path='/login-as-guest' element={<LoginAsGuest />} />
        <Route path='/login-with-email-and-password' element={<LoginWithEmailAndPassword />} />
        <Route path='/gameoverview' element={<Gameoverview />} />
      </Routes>
    </>
  )
}

export default App
