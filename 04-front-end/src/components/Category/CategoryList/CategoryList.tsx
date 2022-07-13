import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ICategory from '../../../models/ICategory.model';
function CategoryList(){
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    useEffect(() => {
        fetch("http://localhost:10000/api/category")
        .then(res => res.json())
        .then(data => {
            setCategories(data);
        })
        .catch(error => {
            setErrorMessage(error?.message ?? 'Unknown error while loading categories...');
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