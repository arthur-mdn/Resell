import {FaSignOutAlt} from "react-icons/fa";
import {Link} from "react-router-dom";

function Profil() {
    return (
        <>
            <div className={"p1"}>
                <Link to={"/logout"} className={"force_button_style"}>
                    <FaSignOutAlt/>
                    Se déconnecter
                </Link>
            </div>
        </>
    );
}

export default Profil;
