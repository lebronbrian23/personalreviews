import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {createReview, getUserReviews} from '../features/reviews/reviewSlice'
import {toast} from "react-toastify";
import {FaInfoCircle} from "react-icons/fa";

function ReviewForm({reviewee ,reviewee_name}) {
    const [formData , setFormData] = useState({
        description:'',
        reviewee_id: '',
        rating:0,
        order_no:'',
    })

    const { description , rating  ,order_no } = formData

    const {isNewReviewError , isNewReviewSuccess ,newReviewMessage } = useSelector(
        (state) => state.reviews )

    const dispatch = useDispatch()

    useEffect(()=> {
            if (isNewReviewError) {
                toast.error(newReviewMessage)
            }
            if (isNewReviewSuccess) {
                toast.success('Review has been added')
                dispatch(getUserReviews(reviewee_name))
            }

        }
        , [reviewee_name, isNewReviewError , isNewReviewSuccess , newReviewMessage ,dispatch]
    )
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
                description, rating, reviewee_id:reviewee
            }
            dispatch(createReview(formData))

            setFormData({
                description:'',
                reviewee_id:'',
                rating:0,
                order_no:'',
            })
        }

    }
    return <form onSubmit={onSubmit}>
        <input type='hidden' value={reviewee} name='revieewee_id'   id='revieewee_id'  />
            <div className="mb-3">
                <label htmlFor="description" className="form-label"></label>
                <textarea className="form-control" id="description" name='description' value={description}
                      rows='4'  placeholder='Enter your description' onChange={onChange}/>
            </div>

            <div className='mb-3 col-5'>
                <label htmlFor='order_no' className='text-gray-500 mb-2 inline' >Order / Invoice No
                    <sup className='text-blue-800 cursor-pointer' data-bs-toggle="tooltip" data-bs-placement="top"
                         title='This will not be displayed publicly, only required if reviewing a product'><FaInfoCircle className='inline'/></sup>
                </label>
                <input className='form-control'  name='order_no' type='text' id='order_no' value={order_no} onChange={onChange}/>
            </div>
            <div className='text-md-end mb-3'>
                <button className='btn btn-primary' type='submit'>Add review</button>
            </div>

        </form>
}

export default ReviewForm
