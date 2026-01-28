export default function Step3({ onPrevStep }) {
  return (
    <div>
      Payment Information
      <button className="btn btn-primary" onClick={onPrevStep}>
        Previous
      </button>
    </div>
  );
}
