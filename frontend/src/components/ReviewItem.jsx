import {useDispatch, useSelector} from "react-redux";
import {deleteReview} from  '../features/reviews/reviewSlice'
import {Link} from "react-router-dom";
import React from "react";
import {FaTrash} from "react-icons/fa";

function ReviewItem({review}) {
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)
    return (
        <div className="card mb-2">
            <div className='card-body text-start'>
                <h4 className="card-title">
                    <div className="row">
                        <div className="col-md-6">
                            <Link className='text-decoration-none' to={'/u/'+review.reviewee_username}>{review.reviewee}</Link>
                            <span className='p-1 text-xs text-end'>
                                {review.createdAt}
                            </span>
                        </div>
                        <div className="col-md-6">
                            <span className='p-1 text-xs text-end right-0'>
                                {[...Array(review.rating)].map((star) => {
                                    return (
                                        <span className="text-amber-400">&#9733;</span>
                                    );
                                })}

                            </span>
                        </div>
                    </div>

                </h4>
                <p className="card-text">{review.description}</p>
                <div className='text-end' title='Delete'>
                    { user ?
                        ( user.user_type === 'general' ? '' : <button onClick={() => dispatch(deleteReview(review.id))} className='text-sm text-danger'><FaTrash/></button> ) :''
                    }
                </div>
            </div>
        </div>
    )
}
export default ReviewItem
