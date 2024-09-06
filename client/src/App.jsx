// App.jsx
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import {AuthProvider, useAuth} from './AuthContext';

import Login from "./pages/Login.jsx";
import Logout from "./pages/Logout.jsx";
import Accueil from './pages/Accueil.jsx';
import Loading from "./components/Loading.jsx";
import Register from "./pages/Register.jsx";
import NavBar from "./components/NavBar.jsx";
import Profil from "./pages/Profil.jsx";
import AddItem from "./components/AddItem.jsx";

const AuthenticatedApp = () => {
    const {authStatus} = useAuth();

        return (
        <Router>
            {authStatus === "loading" ? (
                <Loading/>
            ) : (
                <>
                    <NavBar hidden={authStatus === "unauthenticated"}/>
                    <ToastContainer pauseOnFocusLoss={false} closeOnClick={true}/>
                    <div className={`fc w100 h100 content ${authStatus === "unauthenticated" ? "logged-out" : ""}`}>
                        <Routes>
                            {authStatus === "unauthenticated" ? (
                                <>
                                    {/* Routes publiques */}
                                    <Route path="/" element={<Login/>}/>
                                    <Route path="/login" element={<Login/>}/>
                                    <Route path="/register" element={<Register/>}/>
                                </>
                            ) : (
                                <>
                                    {/* Routes privées */}
                                    <Route path="/" element={<Accueil/>}/>
                                    <Route path="/items/add" element={<AddItem/>}/>
                                    <Route path="/profil" element={<Profil/>}/>
                                    <Route path="/logout" element={<Logout/>}/>
                                </>
                            )}

                            <Route path="*"
                                   element={<Navigate to={authStatus === "unauthenticated" ? "/login" : "/"}/>}/>
                        </Routes>
                    </div>
                    {authStatus === "authenticated" &&
                        <div style={{minHeight: '100px', width: "100%"}} className={`hide-desktop`}></div>
                    }
                </>
            )}
        </Router>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AuthenticatedApp/>
        </AuthProvider>
    );
};

export default App;
