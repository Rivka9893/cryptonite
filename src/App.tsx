import { HashRouter, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import Header from './components/Header'
import Navbar from './components/Navbar'
import About from './pages/About'
import Home from './pages/Home'
import Recommendations from './pages/Recommendations'
import Reports from './pages/Reports'
import { store } from './store/store'

export default function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <Navbar />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </HashRouter>
    </Provider>
  )
}
