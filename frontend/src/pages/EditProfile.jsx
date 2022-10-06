import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {updateUser, reset, getUserByUsername} from "../features/auth/authSlice";


function EditProfile () {

    const { username } = useParams();
    const [bio , setBio] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user ,userProfileData  ,isError ,message,isUpdateUserSuccess } = useSelector((state) => state.auth )


    useEffect(() => {
        if(isError){
            toast.error(message)
        }
        if(!user) {
            navigate('/login')
        }

        dispatch(getUserByUsername(username))

        return () => {
            dispatch(reset())
        }
    },[user ,navigate ,isError, username ,isUpdateUserSuccess , message, dispatch ])

    const onSubmit = async (e) => {
        e.preventDefault()

        dispatch(updateUser({bio } ) )

        if (isUpdateUserSuccess) {
            toast.success('Profile Updated')
            navigate('/profile')
        }

    }

    return (<div className='col-md-6 offset-3 mt-4'>

            <h4>Edit Profile</h4>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='text'>Bio</label>
                    <textarea name='bio' id='bio' onChange={(e) => setBio(e.target.value)}
                    defaultValue={userProfileData.bio}  rows='5'  />
                </div>

                <div className="form-group">
                    <button className='btn btn-primary' type='submit'>Update Profile</button>
                </div>
            </form>
        </div>

    )
}
export default EditProfile
