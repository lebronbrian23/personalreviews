import {useDispatch} from "react-redux";
import {deleteReview} from  '../features/reviews/reviewSlice'

function ReviewItem({review}) {
    const dispatch = useDispatch()
    return (
        <div className='review'>
            <div>
                {review.createdAt}
            </div>
            <h2>{review.reviewee}</h2>
            <h3>{review.description}</h3>
            <button onClick={() => dispatch(deleteReview(review.id))} className='close'>X</button>
        </div>
    )
}
export default ReviewItem
