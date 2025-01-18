const ReviewVerification = ({ reviews, handleApprove, handleReject }) => (
  <div className="review-verification">
    <h2>Review Approvals</h2>
    {reviews.length === 0 ? (
      <p>No reviews to approve.</p>
    ) : (
      <div className="review-verification__list">
      </div>
    )}
  </div>
);

export default ReviewVerification;
