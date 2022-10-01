import {useDispatch, useSelector} from "react-redux";
import {deleteReview} from  '../features/reviews/reviewSlice'
import {Link} from "react-router-dom";

function SearchItem({result}) {

    return (
        <div className='search'>
            <h2><Link to={'/u/'+result.username}>{result.name}</Link></h2>
            <h3>{result.bio}</h3>
        </div>
    )
}
export default SearchItem
