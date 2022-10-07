import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {getReviewsToMe, getReviewsToOthers, reset} from "../features/reviews/reviewSlice";
import ReviewItem from "../components/ReviewItem";
import SearchBar from "../components/SearchBar";
import ProfileSidebar from "../components/ProfileSidebar";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import {useNavigate} from "react-router-dom";

function Profile () {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user } = useSelector((state) => state.auth )
    const {reviewsToOthers , reviewsToMe,  isError  , message} = useSelector((state) => state.reviews)

    useEffect(() => {
        if(isError){
            toast.error(message)
        }
        if(!user) {
            navigate('/login')
        }

        dispatch(getReviewsToOthers())
        dispatch(getReviewsToMe())

        return () => {
            dispatch(reset())
        }
    },[user ,navigate ,isError  , message, dispatch ])

    return (<>
            <div className="row">
                <div className="col-md-7 col-sm-6 order-lg-first order-last">
                    <Tabs defaultActiveKey="to-me">
                        <Tab eventKey="to-me" title="Reviews to me">
                            {reviewsToMe.length > 0 ? (
                                <div>
                                    {reviewsToMe.map((review) => (
                                        <ReviewItem key={review.id} review={review}/>
                                    ))}
                                </div>
                            ) : (
                                <h3>No reviews to me</h3>
                            )}
                        </Tab>
                        <Tab eventKey="to-other" title="Reviews to others">
                            { reviewsToOthers.length > 0 ? (
                                <div>
                                    {reviewsToOthers.map((review) => (
                                        <ReviewItem key={review.id} review={review}/>
                                    ))}
                                </div>
                            ) : (
                                <h3>No reviews to others</h3>
                            ) }
                        </Tab>

                    </Tabs>

                </div>

                <div className="col-md-5 col-sm-6">
                    <SearchBar/>
                    <ProfileSidebar/>
                </div>
            </div>

        </>
    )
}
export default Profile
