import {React ,useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUsersList, reset} from "../features/auth/authSlice";
import SearchItem from "../components/SearchItem";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";

function Users () {

    const dispatch = useDispatch()
    const {usersList  ,isLoading} = useSelector( (state) => state.auth)

    useEffect(() => {

        dispatch(getUsersList())

        return () => {
            dispatch(reset())
        }
    },[    dispatch ])


    if(isLoading){
        return <Spinner/>
    }


    return (<>
        <div className="row">

            <div className="col-md-8 offset-2 col-sm-6 order-lg-first order-last">
                <SearchBar/>

                {usersList.length > 0 && <h3 className='mt-4'>{usersList.length} Users</h3> }

                <div className="">
                    {
                        usersList.length > 0 ? (
                            usersList.map((user) => (
                                <SearchItem key={user.id} result={user}/>
                            ))
                        ) : (
                            <h2 className='mt-8'>No users found</h2>
                        )}
                </div>
            </div>
        </div>
        </>
    )
}

export default Users
