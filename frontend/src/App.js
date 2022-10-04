import React from 'react';
import { BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import SearchResults from "./pages/SearchResults";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
      <>
          <Router>
              <div className='container'>
                  <Header/>
                  <main>
                      <Routes>
                          <Route path='/login' element={<Login/>}></Route>
                          <Route path='/' element={<Login/>}></Route>
                          <Route path='/dashboard' element={<Dashboard/>}></Route>
                          <Route path='/register' element={<Register/>}></Route>
                          <Route path='/forgot-password' element={<ForgotPassword/>}></Route>
                          <Route path='/reset-password' element={<ResetPassword/>}></Route>
                          <Route path='/verify-account' element={<VerifyOtp/>}></Route>
                          <Route path='/profile' element={<Profile/>}></Route>
                          <Route path='/edit-profile' element={<EditProfile/>}></Route>
                          <Route path='/u/:username' element={<PublicProfile/>}></Route>
                          <Route path='/search-users' element={<SearchResults/>}></Route>
                      </Routes>
                  </main>
              </div>
          </Router>
          <ToastContainer/>
      </>
  );
}

export default App;
