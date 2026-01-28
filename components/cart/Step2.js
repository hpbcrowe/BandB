export default function Step2({ onPrevStep, onNextStep }) {
  return (
    <div>
      Contact Details
      <button className="btn btn-primary" onClick={onPrevStep}>
        Previous
      </button>
      <button className="btn btn-primary" onClick={onNextStep}>
        Next
      </button>
    </div>
  );
}
