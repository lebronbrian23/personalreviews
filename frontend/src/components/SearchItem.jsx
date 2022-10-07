import { useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {FaCog, FaEdit} from "react-icons/fa";
import React from "react";
import {Badge} from "react-bootstrap";

function SearchItem({result}) {

    const {user} = useSelector((state) => state.auth)

    return (<>
            <div className="card mb-2">
                <div className='card-body text-start'>
                    <div className="card-title">
                        <Link className='text-decoration-none' to={'/u/'+result.username}>{result.name}
                            {
                                user.user_type !== 'general' &&
                                <small>
                                    <Badge bg="info">{result.user_type}</Badge>{' '}
                                </small>
                            }
                            </Link>

                    </div>
                    <p className="card-text">{result.bio}</p>
                    <p>
                        { user ?
                            ( user.user_type === 'admin' ?
                                <Link to={'/edit-profile/'+result.username}  className="text-sm text-primary text-end" title='Edit'> Manage </Link>
                                :
                                '' )
                            :''
                        }
                    </p>
                </div>
            </div>
        </>
    )
}
export default SearchItem
