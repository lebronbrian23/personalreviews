import React, {useState} from 'react'
import { useNavigate} from "react-router-dom";

function SearchBar () {
    const [search , setSearch] = useState('')
    const navigate = useNavigate()

    const onSearch = (e) => {
        e.preventDefault()

        if(search) {
            navigate({
                pathname: '/search-users',
                search: '?limit=15&search='+ search,
            })
        }
        setSearch('')
    }

    return (<>
            <div className="container">
                <form className="d-flex" role="search" onSubmit={onSearch}>
                    <input className="form-control me-2" type="search" placeholder="Search"
                           aria-label="Search" name='search' value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <button className="btn btn-light" type="submit">Search</button>
                </form>
            </div>
    </>
    )
}
export default SearchBar
