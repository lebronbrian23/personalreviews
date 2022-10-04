import React, {useEffect} from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getUserByUsername ,reset} from "../features/auth/authSlice";
import {getUserReviews} from "../features/reviews/reviewSlice";
import ReviewItem from "../components/ReviewItem";
import ReviewForm from "../components/ReviewForm";
import ProfileSidebar from "../components/ProfileSidebar";
import {FaRegClone} from "react-icons/fa";
import SearchBar from "./SearchBar";

function PublicProfile () {
    const { username } = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user , userProfileData , isError  , message} = useSelector((state) => state.auth )

    const {reviewsByUsername} = useSelector((state) => state.reviews )

    useEffect(() => {

        dispatch(getUserByUsername(username))

        dispatch(getUserReviews(username))

    },[username, navigate ,isError  , message, dispatch ])


    return (<>
            <div className="row">
                <div className="col-md-8 col-sm-6">
                    <div className="text-md-start">
                        {
                            !user ? (
                                <Link to='/login' className='btn' >
                                    Login to leave your review
                                </Link>
                            ):(
                                user._id !== userProfileData.id &&
                                <ReviewForm reviewee_name={userProfileData.username} reviewee={userProfileData.id}/>
                            )

                        }
                    </div>
                    <h3 className='text-md-start'>Reviews to {userProfileData.name}</h3>
                    <div>
                        {
                            reviewsByUsername.length > 0 ? (
                                reviewsByUsername.map((review) => (
                                    <ReviewItem key={review.id} review={review}/>
                                ))
                            ) : (
                                <h3>No reviews found</h3>
                            )}
                    </div>

                </div>

                <div className="col-md-4 col-sm-6 sticky">
                    {user && <SearchBar/>}

                    <div className="container mt-4 mb-4 p-3 justify-content-center">
                        <div className="card p-4">
                            <div className="">
                                <h4>Profile</h4>
                            </div>
                            <div className="image d-flex flex-column justify-content-center align-items-center">

                                <span className="name mt-3">{userProfileData.name}</span>

                                <div className="bio mt-3">
                                    <span>{userProfileData.bio} </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}
export default PublicProfile
