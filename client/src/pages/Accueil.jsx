import {useEffect, useState} from "react";
import axios from "axios";
import config from "../config";

function Accueil() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const itemsResponse = await axios.get(`${config.serverUrl}/items`, {withCredentials: true});

                setItems(itemsResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <div>
                Accueil
            </div>
            <div>
                {
                    items.map(item => (
                        <div key={item._id}>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    ))
                }
            </div>
        </>
    );

}

export default Accueil;
