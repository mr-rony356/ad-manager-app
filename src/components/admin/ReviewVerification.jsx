const ReviewVerification = ({ reviews, handleApprove, handleReject }) => (
  <div className="review-verification">
    {reviews.length === 0 ? (
      <p>No reviews to approve.</p>
    ) : (
      <div className="review-verification__list">
        {reviews.length > 0 &&
          reviews.map((review) => (
            <div key={review._id} className="review-verification__item">
              <p>
                <strong>{review.name}:</strong> {review.review}
              </p>
              <p>Rating: {review.rating}</p>
              <div
                style={{ display: "flex", flexDirection: "row", gap: "0.5em" }}
              >
                <button
                  onClick={() => handleApprove(review._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(review._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        {reviews.length === 0 && <p>No reviews to approve.</p>}
      </div>
    )}
  </div>
);

export default ReviewVerification;
