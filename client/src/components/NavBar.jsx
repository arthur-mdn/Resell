import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {Clock, Monitor, Home, Cog, Plus} from 'lucide-react';
import {useLanguage} from "../LanguageContext.jsx";

function NavBar({hidden}) {
    const location = useLocation();
    const { translations } = useLanguage();

    function isActive(path, base) {
        return path === base || path.startsWith(`${base}/`);
    }

    if (hidden){
        return
    }
    return (
        <>
            <div style={{ minWidth: '100px' }} className={"hide-mobile"}></div>
            <nav className="navbar">
                <ul className="menu">
                    <li className={"fc ai-c hide-mobile"}>
                        <img src={"/elements/logo-only.svg"} className="logo"/>
                    </li>
                    <li className={`menu-item`}>
                        <Link to={'/'}
                              className={`menu-link ${location.pathname === '/' ? 'active' : ''}`}>
                            <Home size={24}/>
                            <span className="menu-link-span">{translations.home}</span>
                        </Link>
                    </li>
                    <li className={`menu-item`}>
                        <Link to={'/items/add'}
                              className={`menu-link ${location.pathname === '/items/add' ? 'active' : ''}`}>
                            <Plus size={24}/>
                            <span className="menu-link-span">{translations.add}</span>
                        </Link>
                    </li>
                    <li className={`menu-item `}>
                        <Link to={'/profil'}
                              className={`menu-link ${isActive(location.pathname, '/settings') ? 'active' : ''}`}>
                            <Cog size={24}/>
                            <span className="menu-link-span">{translations.settings}</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default NavBar;
