"use client";
import { useState } from "react";
import Step1 from "@/components/cart/Step1";
import Step2 from "@/components/cart/Step2";
import Step3 from "@/components/cart/Step3";
import { GoCheckCircleFill } from "react-icons/go";
import Link from "next/link";
import { useCart } from "@/context/cart";

export default function Cart() {
  //get cart items from context
  const { cartItems } = useCart();

  //state
  const [step, setStep] = useState(1);

  //function to go to next step
  const handlNextStep = () => {
    setStep(step + 1);
  };

  //function to go to previous step
  const handlePrevStep = () => {
    setStep(step - 1);
  };

  if (!cartItems?.length) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100 ">
        <div className="text-center">
          <p className="lead">Your cart is empty</p>
          <Link className="btn btn-lg btn-primary btn-raised" href="/shop">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  //function to show tick icon for completed steps
  const tickIcon = (stepNumber) => {
    return step === stepNumber ? (
      <GoCheckCircleFill className="mb-1 text-danger" />
    ) : null;
  };
  return (
    <div>
      <div className="col-lg-6 offset-lg-3 my-5">
        <div className="d-flex justify-content-between lead">
          <div>{tickIcon(1)} Review Cart</div>
          <div>{tickIcon(2)} Contact Details</div>
          <div>{tickIcon(3)} Payment</div>
        </div>
      </div>

      {step === 1 && <Step1 onNextStep={handlNextStep} />}
      {step === 2 && (
        <Step2 onPrevStep={handlePrevStep} onNextStep={handlNextStep} />
      )}
      {step === 3 && <Step3 onPrevStep={handlePrevStep} />}
    </div>
  );
}
