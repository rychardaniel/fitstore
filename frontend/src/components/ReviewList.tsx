import type { Review } from "../types";
import { StarRating } from "./StarRating";

interface ReviewListProps {
    reviews: Review[];
    currentUserId?: number;
    onEdit?: (review: Review) => void;
    onDelete?: (reviewId: number) => void;
}

export function ReviewList({
    reviews,
    currentUserId,
    onEdit,
    onDelete,
}: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="review-list__empty">
                <p>No reviews yet. Be the first to review this product!</p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="review-list">
            {reviews.map((review) => (
                <div key={review.id} className="review-list__item">
                    <div className="review-list__header">
                        <div className="review-list__user">
                            <span className="review-list__username">
                                {review.userName}
                            </span>
                            <span className="review-list__date">
                                {formatDate(review.createdAt)}
                            </span>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                    </div>

                    {review.title && (
                        <h4 className="review-list__title">{review.title}</h4>
                    )}

                    {review.comment && (
                        <p className="review-list__comment">{review.comment}</p>
                    )}

                    {currentUserId === review.userId &&
                        (onEdit || onDelete) && (
                            <div className="review-list__actions">
                                {onEdit && (
                                    <button
                                        onClick={() => onEdit(review)}
                                        className="review-list__edit"
                                    >
                                        Edit
                                    </button>
                                )}
                                {onDelete && (
                                    <button
                                        onClick={() => onDelete(review.id)}
                                        className="review-list__delete"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        )}
                </div>
            ))}
        </div>
    );
}
