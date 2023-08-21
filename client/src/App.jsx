import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import SavedRecipes from './pages/SavedRecipes';
import CreateRecipes from './pages/CreateRecipes';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {

  return (
    <>
      <div className='App'>
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/auth' element={<Auth />} />
            <Route path='/savedRecipes' element={<SavedRecipes />} />
            <Route path='/createRecipes' element={<CreateRecipes />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
