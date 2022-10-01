import React, {useEffect} from 'react'
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {getMe} from "../features/auth/authSlice";
import {getReviewsToMe, getReviewsToOthers, reset} from "../features/reviews/reviewSlice";
import ReviewItem from "../components/ReviewItem";
import {FaRegClone} from "react-icons/fa";

function Profile () {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user , userData} = useSelector((state) => state.auth )
    const {reviewsToOthers , reviewsToMe,  isError  , message} = useSelector((state) => state.reviews)

    const url = window.location.href.split('/')
    const generate_profile_link =  userData && url[0]+'//'+url[1]+url[2]+'/u/'+ userData.profile_link

    useEffect(() => {
        if(isError){
            toast.error(message)
        }
        if(!user) {
            navigate('/login')
        }

        dispatch(getMe())
        dispatch(getReviewsToOthers())
        dispatch(getReviewsToMe())

        return () => {
            dispatch(reset())
        }
    },[user ,navigate ,isError  , message, dispatch ])

    const copy = async () => {
        await navigator.clipboard.writeText(generate_profile_link);
        toast.success('Link copied');
    }

    return (<>
            <section className='heading'>
                <h3>Profile</h3>

                <div className='profile'>
                    <div className=''>
                        <span>Name</span>
                        <span>{userData.name}</span>
                    </div>
                    <div className=''>
                        <span>Phone</span>
                        <span>{userData.phone}</span>
                    </div>
                    <div className=''>
                        <span>Email</span>
                        <span>{userData.email}</span>
                    </div>
                    <div className=''>
                        <span>Username</span>
                        <span>{userData.username}</span>
                    </div>
                    <div className=''>
                        <span>Profile Link</span>
                        <span>{generate_profile_link}</span>
                        <button onClick={copy} disabled={!generate_profile_link}><FaRegClone/></button>
                    </div>
                    <div className=''>
                        <span>Bio</span>
                        <span>{userData.bio}</span>
                    </div>
                    <div>
                        <button className='btn'>Edit Bio</button>
                    </div>
                </div>
            </section>

            <section className='content'>
                <h3>Reviews to others</h3>
                { reviewsToOthers.length > 0 ? (
                    <div className='reviews'>
                        {reviewsToOthers.map((review) => (
                            <ReviewItem key={review.id} review={review}/>
                        ))}
                    </div>
                ) : (
                    <h3>No reviews to others</h3>
                ) }
            </section>

            <section className='content'>
                <h3>Reviews to Me</h3>
                {reviewsToMe.length > 0 ? (
                    <div className='reviews'>
                        {reviewsToMe.map((review) => (
                            <ReviewItem key={review.id} review={review}/>
                        ))}
                    </div>
                ) : (
                    <h3>No reviews to me</h3>
                )}
            </section>
        </>
    )
}
export default Profile
