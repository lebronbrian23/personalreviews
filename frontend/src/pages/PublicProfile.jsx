import React, {useEffect} from 'react'
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {getUserByUsername ,reset} from "../features/auth/authSlice";
import {getUserReviews} from "../features/reviews/reviewSlice";
import ReviewItem from "../components/ReviewItem";
import ReviewForm from "../components/ReviewForm";

function PublicProfile () {
    const { username } = useParams();
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user , userProfileData , isError  , message} = useSelector((state) => state.auth )

    const {reviewsByUsername} = useSelector((state) => state.reviews )

    useEffect(() => {

        dispatch(getUserByUsername(username))

        dispatch(getUserReviews(username))

        return () => {
            dispatch(reset())
        }
    },[username, navigate ,isError  , message, dispatch ])


    return (<>
            <section className='heading'>
                <h3>Profile</h3>

                <div className='profile'>
                    <div className=''>
                        <span>Name</span>
                        <span>{userProfileData.name}</span>
                    </div>

                    <div className=''>
                        <span>Bio</span>
                        <span>{userProfileData.bio}</span>
                    </div>
                    {
                        !user ? (
                            <Link to='/login' className='btn' >
                                Login to leave your review
                            </Link>
                            ):(
                                user._id !== userProfileData.id &&
                                    <ReviewForm reviewee={userProfileData.id}/>
                        )

                    }
                </div>
            </section>

            <section className='content'>
                { reviewsByUsername.length > 0 ? (
                    <div className='reviews'>
                        {reviewsByUsername.map((review) => (
                            <ReviewItem key={review.id} review={review}/>
                        ))}
                    </div>
                ) : (
                    <h3>No reviews , be the first to  review {userProfileData.name}</h3>
                ) }
            </section>

        </>
    )
}
export default PublicProfile
