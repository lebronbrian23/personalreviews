import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {updateUser, reset, getUserByUsername} from "../features/auth/authSlice";
import Form from 'react-bootstrap/Form';


function EditProfile () {

    const { username } = useParams();
    const [bio , setBio] = useState('')
    const [is_active , setIs_active] = useState('')

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
                    <label htmlFor='is_active'>Is active</label>
                    <select id='is_active' name='is_active' value={is_active}
                            onChange={(e) => setIs_active(e.target.value)}
                            className="form-select form-select-lg mb-3" aria-label=".form-select-lg">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
                {is_active}
                <Form.Select aria-label="select example"
                             id='is_active' name='is_active' value={is_active} onChange={(e) => setIs_active(e.target.value)}>
                    <option>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </Form.Select>
                <div className="form-group">
                    <button className='btn btn-primary' type='submit'>Update Profile</button>
                </div>
            </form>
        </div>

    )
}
export default EditProfile
