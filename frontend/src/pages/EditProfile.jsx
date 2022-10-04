import React, {useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {updateUser , reset} from "../features/auth/authSlice";


function EditProfile ({userData}) {
    const [bio , setBio] = useState('')
    const [photo , setPhoto] = useState(null)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user ,isError ,message } = useSelector((state) => state.auth )


    useEffect(() => {
        if(isError){
            toast.error(message)
        }
        if(!user) {
            navigate('/login')
        }

        return () => {
            dispatch(reset())
        }
    },[user ,navigate ,isError  , message, dispatch ])

    const onChange = (e) => {
        setBio((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }
    const handleFileInput = (e) => {
        setPhoto(e.target.files[0]);
    }
    const onSubmit = async (e) => {
        e.preventDefault()

        //let  convertedFile = photo ? await convertToBase64(photo) : '';

        const formData = { bio  }
        dispatch(updateUser(formData))

    }
    const convertToBase64 = (file) => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            }
        })
    }

    return (<section className='form'>
            {userData}
            <form onSubmit={onSubmit}>

                <div className='form-group'>
                    <label htmlFor='text'>Photo</label>
                    <input name='photo' id='photo' type='file' accept="image/*"  onChange={handleFileInput}/>
                </div>
                <div className='form-group'>
                    <label htmlFor='text'>Bio</label>
                    <textarea name='bio' id='bio' value={bio} onChange={(e) => setBio(e.target.value)}/>
                </div>

                <div className="form-group">
                    <button className='btn btn-block' type='submit'>Update Profile</button>
                </div>
            </form>
        </section>
    )
}
export default EditProfile
