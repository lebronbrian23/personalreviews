import {useState} from "react";
import { useDispatch} from "react-redux";
import {createReview} from '../features/reviews/reviewSlice'
import {toast} from "react-toastify";

function ReviewForm({reviewee}) {
    const [formData , setFormData] = useState({
        description:'',
        reviewee_id: reviewee,
        rating:0,

    })

    const { description , rating ,reviewee_id } = formData


    const dispatch = useDispatch()

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const onSubmit = (e) => {
        e.preventDefault()

        if(description === '') {
            toast.error('Please enter a description')
        }else if(rating < 0 || rating > 5) {
            toast.error('Please select a rating between 0 - 5')
        }else {
            const formData = {
                description, rating, reviewee_id
            }
            dispatch(createReview(formData))

            setFormData({
                description:'',
                reviewee_id:'',
                rating:0})
        }

    }
    return <section className='form'>
        <form onSubmit={onSubmit}>
            <div className='form-group'>
                <label htmlFor='text'>Review</label>
                <textarea name='description' value={description} onChange={onChange}/>
            </div>
            <div className='form-group'>
                <label htmlFor='text'>Rating</label>
                <input name='rating' type='number' value={rating} onChange={onChange}/>
            </div>
            <div className="form-group">
                <button className='btn btn-block' type='submit'>Add review</button>
            </div>
        </form>
    </section>
}

export default ReviewForm
