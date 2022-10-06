import React from 'react'
import {useEffect} from 'react'
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector , useDispatch} from "react-redux";
import Spinner from "../components/Spinner";
import {searchUsers , reset} from "../features/auth/authSlice";
import {toast} from "react-toastify";
import SearchItem from "../components/SearchItem";
import SearchBar from "../components/SearchBar";

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
            <div className="row">

                <div className="col-md-8 offset-2 col-sm-6 order-lg-first order-last">
                    <SearchBar/>
                    <h3 className='mt-4'>{searchResults.length} search results containing {search}</h3>

                    <div className="">
                        {searchResults.length > 0 ? (
                            searchResults.map((result) => (
                                <SearchItem key={result.id} result={result}/>
                            ))
                        ) : (
                            <h3>No results found</h3>
                        )
                        }
                    </div>
                </div>
            </div>
    </>
    )
}
export default SearchResults
