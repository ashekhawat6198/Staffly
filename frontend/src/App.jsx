import { BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./routes/ProtectedRoute"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { fetchCurrentUser } from "./redux/slices/authSlice"

function App() {
  // when page gets refreshed the user data wiped out from redux
  // so it immadiately call this useeffect function and check for token
  // if token is available in localstorage it get the data of logged in user
  
   const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);
  return (
   <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard" element={
        <ProtectedRoute>
            <Dashboard/>
        </ProtectedRoute>}/>
    </Routes>
   </BrowserRouter>
  )
}

export default App
