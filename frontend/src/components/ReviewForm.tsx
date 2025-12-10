import { useState } from "react";
import type { CreateReview } from "../types";
import { StarRating } from "./StarRating";

interface ReviewFormProps {
    onSubmit: (review: CreateReview) => Promise<void>;
    initialRating?: number;
    initialTitle?: string;
    initialComment?: string;
    submitLabel?: string;
    onCancel?: () => void;
}

export function ReviewForm({
    onSubmit,
    initialRating = 0,
    initialTitle = "",
    initialComment = "",
    submitLabel = "Submit Review",
    onCancel,
}: ReviewFormProps) {
    const [rating, setRating] = useState(initialRating);
    const [title, setTitle] = useState(initialTitle);
    const [comment, setComment] = useState(initialComment);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                rating,
                title: title || undefined,
                comment: comment || undefined,
            });
            setRating(0);
            setTitle("");
            setComment("");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to submit review"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <div className="review-form__rating">
                <label className="review-form__label">Your Rating</label>
                <StarRating
                    rating={rating}
                    interactive
                    onRatingChange={setRating}
                    size="lg"
                />
            </div>

            <div className="review-form__field">
                <label htmlFor="review-title" className="review-form__label">
                    Title (optional)
                </label>
                <input
                    id="review-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="review-form__input"
                    placeholder="Summarize your experience"
                    maxLength={100}
                />
            </div>

            <div className="review-form__field">
                <label htmlFor="review-comment" className="review-form__label">
                    Your Review (optional)
                </label>
                <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="review-form__textarea"
                    placeholder="Share your experience with this product"
                    rows={4}
                    maxLength={1000}
                />
            </div>

            {error && <p className="review-form__error">{error}</p>}

            <div className="review-form__actions">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="review-form__cancel"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="review-form__submit"
                    disabled={isSubmitting || rating === 0}
                >
                    {isSubmitting ? "Submitting..." : submitLabel}
                </button>
            </div>
        </form>
    );
}
