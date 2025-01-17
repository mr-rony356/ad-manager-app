const ReviewVerification = ({ reviews, handleApprove, handleReject }) => (
  <div className="review-verification">
    <h2>Review Approvals</h2>
    {reviews.length === 0 ? (
      <p>No reviews to approve.</p>
    ) : (
      <div className="review-verification__list">
        {reviews.map((review) => (
          <div key={review._id} className="review-verification__item">
            <p>
              <strong>{review.name}:</strong> {review.review}
            </p>
            <p>Rating: {review.rating}</p>
            <div
              style={{ display: "flex", flexDirection: "row", gap: "0.5em" }}
            >
              <Checkbox
                id={`approve-${review._id}`}
                name={`approve-${review._id}`}
                label="Approve"
                onChange={() => handleApprove(review._id)}
              />
              <Checkbox
                id={`reject-${review._id}`}
                name={`reject-${review._id}`}
                label="Reject"
                onChange={() => handleReject(review._id)}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ReviewVerification;
