export default function ProductFilter({ searchParams }) {
  return (
    <div>
      <p className="lead">Filter Products</p>
      <pre>{JSON.stringify(searchParams, null, 4)}</pre>
    </div>
  );
}
