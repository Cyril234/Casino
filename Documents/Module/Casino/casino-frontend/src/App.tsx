import { Route, Routes } from 'react-router'
import './styles/App.css'
import Loginoverview from './components/login/Loginoverview'
import LoginWithBadge from './components/login/LoginWithBadge'
import LoginWithEmailAndPassword from './components/login/LoginWithUsernameAndPassword'
import LoginAsGuest from './components/login/LoginAsGuest'
import Start from './components/Start'
import Gameoverview from './components/Gamesoverview'
import Register from './components/Register'
import BlackJackGame from './components/Games/BlackJack'

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
        <Route path='/register' element={<Register />} />
        <Route path='/blackjack' element={<BlackJackGame playerId={1} />} />
      </Routes>
    </>
  )
}

export default App
