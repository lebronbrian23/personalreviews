import React from 'react'
import {useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {useSelector , useDispatch} from "react-redux";
import ReviewItem from '../components/ReviewItem'
import Spinner from "../components/Spinner";
import {getReviews , reset} from "../features/reviews/reviewSlice";
import {toast} from "react-toastify";
import ProfileSidebar from "../components/ProfileSidebar";
import SearchBar from "../components/SearchBar";

function Dashboard () {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user} = useSelector((state) => state.auth)
    const {allReviews , isLoading , isError  , message} = useSelector((state) => state.reviews)

    useEffect(() => {
        if(isError){
            toast.error(message)
        }
        if(!user) {
            navigate('/login')
        }

        dispatch(getReviews())

        return () => {
             dispatch(reset())
         }
    },[user ,navigate ,isError  , message, dispatch ])


    if(isLoading){
        return <Spinner/>
    }
    return (<>
            <div className="row">
                <div className="col-md-8 col-sm-6 order-lg-first order-last">

                    <h3 className='text-md-start left'>Latest reviews</h3>
                    <div>
                        {
                            allReviews.length > 0 ? (
                                allReviews.map((review) => (
                                    <ReviewItem key={review.id} review={review}/>
                                ))
                        ) : (
                            <h3>No reviews found</h3>
                        )}
                    </div>

                </div>

                <div className="col-md-4 col-sm-6">
                    <SearchBar/>
                    <ProfileSidebar/>
                </div>
            </div>
    </>
    )
}
export default Dashboard
