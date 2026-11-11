import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { setSearch } from '../store/coinsSlice'
import { useAppDispatch, useAppSelector } from '../store/store'

export default function Navbar() {
  const dispatch = useAppDispatch()
  const search = useAppSelector((state) => state.coins.search)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  function handleSearch(value: string) {
    dispatch(setSearch(value))
    if (pathname !== '/') {
      navigate('/')
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/recommendations">Recommendations</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </nav>
  )
}
