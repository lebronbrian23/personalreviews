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
                <h4 className="card-title"><Link className='text-decoration-none' to={'/u/'+review.reviewee_username}>{review.reviewee}</Link>
                    <span className='p-1 text-xs text-end'>
                        {review.createdAt}
                    </span>
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
