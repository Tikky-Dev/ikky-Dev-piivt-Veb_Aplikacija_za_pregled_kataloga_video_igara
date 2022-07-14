import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import IPlatform from '../../../models/IPlatform.model';
function PlatformList(){
    const [categories, setCategories] = useState<IPlatform[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    useEffect(() => {

        api("get", "/api/platform", "user")
        .then(apiResponse => {
            if(apiResponse.status === "error"){
                throw { message: "Unknown error while loading categories...", }
            }
            
            setCategories(apiResponse.data);

        })
        .catch(err => {
            setErrorMessage(err?.message ?? 'Unknown error while loading categories...')
        })
    }, [])

    return (
        <div>
            {errorMessage && <p>Error: {errorMessage}</p>}
            {!errorMessage &&
                <ul>
                    {categories.map(c => (
                        <li key={"platform-"+c.platformId}>
                            <Link to={"/categories/"+c.platformId}>
                                {c.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
}

export default PlatformList;