import React from 'react'
import {useEffect} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector , useDispatch} from "react-redux";
import Spinner from "../components/Spinner";
import {searchUsers , reset} from "../features/auth/authSlice";
import {toast} from "react-toastify";
import SearchItem from "../components/SearchItem";

function SearchResults () {
    const location = useLocation();
    const search = new URLSearchParams(location.search).get("search");
    const limit = new URLSearchParams(location.search).get("limit");

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {searchResults , isLoading , isError  , message} = useSelector((state) => state.auth)


    useEffect(() => {
        if(isError){
            toast.error(message)
        }

        const search_query = { limit , search }

        dispatch(searchUsers(search_query))

        return () => {
             dispatch(reset())
         }
    },[ limit , search, navigate ,isError  , message, dispatch ])


    if(isLoading){
        return <Spinner/>
    }
    return (<>
        <section className='heading'>
            <h1>{searchResults.length} search results containing {search}</h1>
        </section>

        <section className='content'>
            {searchResults.length > 0 ? (
                <div className='reviews'>
                    {searchResults.map((result) => (
                        <SearchItem key={result.id} result={result}/>
                    ))}
                </div>
            ) : (
                <h3>No results found</h3>
            )
            }
        </section>
    </>
    )
}
export default SearchResults
