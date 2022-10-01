import {useDispatch, useSelector} from "react-redux";
import {deleteReview} from  '../features/reviews/reviewSlice'
import {Link} from "react-router-dom";

function ReviewItem({review}) {
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)
    return (
        <div className='review'>
            <div>
                {review.createdAt}
            </div>
            <h2><Link to={'/u/'+review.reviewee_username}>{review.reviewee}</Link></h2>
            <h3>{review.description}</h3>
            { user && user.user_type === 'general' ? '' : <button onClick={() => dispatch(deleteReview(review.id))} className='close'>X</button>}
        </div>
    )
}
export default ReviewItem
