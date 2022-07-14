import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import './AdminReviewList.sass';
import api from "../../../../api/api";
import IReview from "../../../../models/IReview.model";

interface IAdminReviewRowProperties {
    review: IReview;
}

export default function AdminReviewList() {
    const [ reviews, setReviews ] = useState<IReview[]>([]);
    const [ errorMessage, setErrorMessage ] = useState<string>("");

    function loadReviews() {
        api("get", "/api/review", "administrator")
        .then(res => {
            if (res.status === 'error') {
                return setErrorMessage(res.data + "");
            }

            setReviews(res.data);
        });
    }

    useEffect(loadReviews, [ ]);

    function AdminReviewRow(props: IAdminReviewRowProperties) {
        const [ newComment, setNewComment ] = useState<string>(props.review.comment);
        const [ editCommentVisible, setEditCommentVisible ] = useState<boolean>(false);

        const activeSideClass   = props.review.isAproved ? " btn-primary" : " btn-light";
        const inactiveSideClass = !props.review.isAproved ? " btn-primary" : " btn-light";

        function doToggleReviewActiveState() {
            api("put", "/api/user/review/" + props.review.reviewId, "administrator", {
                isApproved: !props.review.isAproved,
            })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage(res.data + "");
                }

                loadReviews();
            });
        }

        function doEditComment() {
            api("put", "/api/user/review/" + props.review.reviewId, "administrator", {
                comment: newComment,
            })
            .then(res => {
                if (res.status === 'error') {
                    return setErrorMessage(res.data + "");
                }

                loadReviews();
            });
        }

        return (
            <>
                { !props.review.isAproved && 
                    <tr>
                        <td>{ props.review.reviewId }</td>
                        <td>{props.review.rating}</td>
                        <td>
                            { !editCommentVisible &&
                                <div className="row">
                                    <span className="col col-9">{ props.review.comment }</span>
                                    <div className="col col-3">
                                        <button className="btn btn-primary btn-sm" onClick={ () => setEditCommentVisible(true) }>
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            }
                            { editCommentVisible && <div>

                                <div className="form-group mb-3">
                                    <input type="text" className="form-control form-control-sm" value={ newComment } onChange={ e => setNewComment(e.target.value) } />
                                </div>

                                { (newComment !== props.review.comment) &&
                                ( <button className="btn btn-sm btn-primary" onClick={ () => doEditComment() }>
                                    Edit
                                </button> ) }

                                <button className="btn btn-sm btn-danger" onClick={ () => {
                                    setNewComment(props.review.comment);
                                    setEditCommentVisible(false);
                                } }>
                                    Cancel
                                </button>
                            </div> }
                        </td>
                        <td>
                            <div className="btn-group" onClick={() => { doToggleReviewActiveState() }}>
                                <div className={"btn btn-sm" + activeSideClass}>
                                    <FontAwesomeIcon icon={ faSquareCheck } />
                                </div>
                                <div className={"btn btn-sm" + inactiveSideClass}>
                                    <FontAwesomeIcon icon={ faSquare } />
                                </div>
                            </div>
                        </td>
                    </tr>
                }
            </>
        );
    }

    return (
        <div>
            { errorMessage && <p className="alert aler-danger">{ errorMessage }</p> }
            { !errorMessage &&
                <table className="table table-sm table-hover review-list">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Status (Approved)</th>
                        </tr>
                    </thead>
                    <tbody>
                        { reviews.map(review => <AdminReviewRow key={ "review" + review.reviewId } review={ review } />) }
                    </tbody>
                </table>
            }
        </div>
    );
}