import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCart } from "@/context/cart";
import OrderSummary from "@/components/cart/OrderSummary";

export default function Step2({ onPrevStep, onNextStep }) {
  const { data, status, update } = useSession();
  //udpate({user: {...data.user, phone: '1234567890'}})

  if (status !== "authenticated") {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-8 offset-lg-2">
            <div className="d-flex justify-content-end my-4">
              <button
                className="btn btn-outline-danger btn-raised col-6"
                onClick={onPrevStep}
              >
                Previous
              </button>
              <Link
                className="btn btn-primary btn-raised col-6"
                href={`/login?callbackURL=${window.location.pathname}`}
              >
                Login to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8 ">
          <p className="alert alert-primary">Contact Details</p>
          <div>
            <input
              value={data?.user?.name}
              className="form-control mb-2 px-2"
              disabled
            />
            <input
              value={data?.user?.email}
              className="form-control mb-2 px-2"
              disabled
            />
          </div>
          <div className="d-flex justify-content-end my-4">
            <button
              className="btn btn-outline-danger btn-raised col-6"
              onClick={onPrevStep}
            >
              Previous
            </button>
            <button
              className="btn btn-primary btn-raised col-6"
              onClick={onNextStep}
            >
              Next
            </button>
          </div>
        </div>
        <div className="col-lg-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
