export default function Step1({ onNextStep }) {
  return (
    <div>
      Review Cart
      <button className="btn btn-primary" onClick={onNextStep}>
        Next
      </button>
    </div>
  );
}
