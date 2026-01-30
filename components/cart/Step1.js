import { useCart } from "@/context/cart";
import Image from "next/image";
import Link from "next/link";
import AddToCart from "@/components/product/AddToCart";

export default function Step1({ onNextStep }) {
  //get cart items from context
  const { cartItems } = useCart();

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <p className="alert alert-primary"> Review Cart / Adjust Quantity</p>
          {cartItems?.map((product) => (
            <div className="card mb-3" key={product?._id}>
              <div className="row g-0">
                <div className="col-lg-4">
                  {" "}
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <Image
                      src={
                        product?.images?.[0]?.secure_url ||
                        "/images/default.jpeg"
                      }
                      width={500}
                      height={300}
                      alt={product?.title}
                      className="card-img-top"
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link href={`/product/${product?.slug}`}>
                        {product?.title}
                      </Link>
                    </h5>
                    <h4>${product?.price?.toFixed(2)}</h4>
                    <div className="card-text">
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            product?.description?.length > 160
                              ? `${product?.description?.substring(0, 160)}...`
                              : product?.description,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-4 ">
          <p>Order Summary</p>
        </div>
      </div>
    </div>
  );
}
