import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {updateUser, reset, getUserByUsername ,getAccountTypes} from "../features/auth/authSlice";
import Form from 'react-bootstrap/Form';
import ReviewItem from "../components/ReviewItem";


function EditProfile () {

    const { username } = useParams();
    const [bio , setBio] = useState('')
    const [is_account_active , setIs_active] = useState('')
    const [user_type , setUser_type] = useState('')

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user ,userProfileData , accountTypes ,isError ,message,isUpdateUserSuccess } = useSelector((state) => state.auth )

    useEffect(() => {
        if(isError){
            toast.error(message)
        }
        if(!user) {
            navigate('/login')
        }
        dispatch(getAccountTypes())

        dispatch(getUserByUsername(username))

        return () => {
            dispatch(reset())
        }
    },[user ,navigate , isError, username ,isUpdateUserSuccess ,accountTypes , message, dispatch ])

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
                    <label htmlFor='is_active'>Is active</label>
                    <select id='is_account_active' name='is_account_active' value={is_account_active}
                            onChange={(e) => setIs_active(e.target.value)}
                            className="form-select form-select-lg mb-3" aria-label=".form-select-lg">
                        <option value={userProfileData.is_account_active} >{ userProfileData.is_account_active }</option>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>

               <div className="form-group">
                    <label htmlFor='is_active'>User Type</label>
                    <select id='user_type' name='user_type' value={user_type}
                            onChange={(e) => setUser_type(e.target.value)}
                            className="form-select form-select-lg mb-3" aria-label=".form-select-lg">
                        <option value={userProfileData.user_type} >{ userProfileData.user_type }</option>
                        {/*{
                            accountTypes.map((type) => (
                                <option value={type.id}>{type.name}</option>
                            ))
                        }*/}
                    </select>
                </div>
                {
                    accountTypes.length
                }
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Check this switch"
                />
                <div className="form-group">
                    <button className='btn btn-primary' type='submit'>Update Profile</button>
                </div>
            </form>
        </div>

    )
}
export default EditProfile
