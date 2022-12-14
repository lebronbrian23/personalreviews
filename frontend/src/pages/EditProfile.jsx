import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {updateUser, reset, getUserByUsername} from "../features/auth/authSlice";



function EditProfile () {

    const { username } = useParams();
    const [formData, setFormData] = useState({
    bio:'',
    user_id:'',
    user_type:'',
    is_account_active:'',
    })

    const { bio , user_type , is_account_active  } = formData

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
    },[user ,navigate , isError, username ,isUpdateUserSuccess  , message, dispatch ])

    const onChange =  (e) => {
        setFormData((prevState ) =>({
            ...prevState,
            [e.target.name]:e.target.value,
        }) )

    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const data = {
            new_bio: bio,
            new_is_account_active: is_account_active,
            new_user_type: user_type,
            user_id: userProfileData.id
        }
        dispatch(updateUser(data) )

        if (isUpdateUserSuccess) {
            toast.success('Profile Updated')
            if(user.user_type === 'admin')
                navigate('/users')
            else
                navigate('/profile')
        }

    }

    return (<div className='col-md-6 offset-3 mt-4'>

            <h4>Edit Profile - {userProfileData.name}</h4>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='text'>Bio</label>
                    <textarea name='bio' id='bio' onChange={onChange}
                    defaultValue={userProfileData.bio}  rows='5'  />
                </div>

                { user.user_type === 'admin' &&  user.id !== userProfileData.id &&
                    <div className="form-group">
                        <label htmlFor='user_type'>User Account Type</label>
                        <select id='user_type' name='user_type' onChange={onChange}
                                className="form-select form-select-lg mb-3" aria-label=".form-select-lg">
                            <option value={userProfileData.user_type} >{ userProfileData.user_type }</option>
                            <option value="general">general</option>
                            <option value="admin">admin</option>
                            <option value="moderator">moderator</option>
                        </select>
                    </div>
                }

                {user.user_type === 'admin' && user.id !== userProfileData.id &&
                    <div className="form-group">
                        <label htmlFor='is_account_active'>Is account active</label>
                        <select id='is_account_active' name='is_account_active' onChange={onChange}
                                className="form-select form-select-lg mb-3" aria-label=".form-select-lg">
                            <option
                                value={userProfileData.is_account_active}>{userProfileData.is_account_active}</option>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>
                }

                <div className="form-group">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type='submit'>Update Profile</button>
                </div>
            </form>
        </div>

    )
}
export default EditProfile
