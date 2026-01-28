"use client";
import { useState } from "react";
import Step1 from "@/components/cart/Step1";
import Step2 from "@/components/cart/Step2";
import Step3 from "@/components/cart/Step3";

export default function Cart() {
  const [step, setStep] = useState(1);

  //function to go to next step
  const handlNextStep = () => {
    setStep(step + 1);
  };

  //function to go to previous step
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  return (
    <div>
      {step === 1 && <Step1 onNextStep={handlNextStep} />}
      {step === 2 && (
        <Step2 onPrevStep={handlePrevStep} onNextStep={handlNextStep} />
      )}
      {step === 3 && <Step3 onPrevStep={handlePrevStep} />}
    </div>
  );
}
