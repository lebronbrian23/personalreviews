import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import {toast} from "react-toastify";
import {getMe , reset} from "../features/auth/authSlice";
import {FaRegClone} from "react-icons/fa";

function ProfileSidebar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const {user , userData} = useSelector((state) => state.auth )

    const url = window.location.href.split('/')
    const generate_profile_link =  userData && url[0]+'//'+url[1]+url[2]+'/u/'+ userData.profile_link

    useEffect(() => {

        if(!user) {
            navigate('/login')
        }

        dispatch(getMe())

        return () => {
            dispatch(reset())
        }
    },[user ,navigate , dispatch ])

    const copy = async () => {
        await navigator.clipboard.writeText(generate_profile_link);
        toast.success('Link copied');
    }
    return (
        <div className="container mt-4 mb-4 p-3 justify-content-center">
            <div className="card p-4">
                        <div className="">
                            <h4>Profile</h4>
                        </div>
                        <div className="image d-flex flex-column justify-content-center align-items-center">

                            <span className="name mt-3">{userData.name}</span>
                            <span className="username">{userData.username}</span>
                            <span className="username">{userData.email}</span>
                            <span className="username">{userData.phone}</span>
                            <div className="d-flex flex-row justify-content-center align-items-center flex-wrap">
                                    <span className="profile-link">{generate_profile_link}</span>
                                    <span className='p-1'><button onClick={copy} disabled={!generate_profile_link}> <FaRegClone/></button></span>
                            </div>
                            <div className="bio mt-3">
                                <span>{userData.bio} </span>
                            </div>
                            <div className=" d-flex mt-2">
                                <Link to={'/edit-profile/'+userData.username}  className="btn btn-primary">Edit Profile</Link>
                            </div>
                        </div>
                    </div>
        </div>

    )
}
export default ProfileSidebar
