import {FaSignOutAlt} from "react-icons/fa";
import {Link} from "react-router-dom";
import {useLanguage} from "../LanguageContext.jsx";

function Profil() {
    const {translations} = useLanguage();
    return (

        <div className={"p1 fc g1"}>
            <h2>{translations.settings}</h2>
            <Link to={"/logout"} className={"force_button_style"}>
                <FaSignOutAlt/>
                {translations.logout}
            </Link>
        </div>

    );
}

export default Profil;
