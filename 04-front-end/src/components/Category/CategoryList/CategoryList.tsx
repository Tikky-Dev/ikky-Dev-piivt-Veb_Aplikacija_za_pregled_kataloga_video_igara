import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../api/api';
import ICategory from '../../../models/ICategory.model';
function CategoryList(){
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    useEffect(() => {

        api("get", "/api/category", "user")
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
                        <li key={"category-"+c.categoryId}>
                            <Link to={"/categories/"+c.categoryId}>
                                {c.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
}

export default CategoryList;