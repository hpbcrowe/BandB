import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs";

dayjs.extend(relativeTime);

export default function ({ product }) {
  return (
    <div key={product?._id} className="card my-4 col-lg-4">
      <div style={{ height: "200px", overflow: "hidden" }}>
        <Image
          src={product?.images?.[0].secure_url || "/images/default.jpeg"}
          width={500}
          height={300}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          alt={product?.title}
        />
      </div>
    </div>
  );
}
