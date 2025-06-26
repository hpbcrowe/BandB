"use client";
import { useState } from "react";
// This is a client-side component that allows users to register
// It uses React hooks to manage state and handle form submission
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // This is the loading state to show a loading spinner or disable the button
  // while the registration request is being processed
  // This prevents the user from submitting the form multiple times
  // and provides feedback that the request is being processed
  // It is set to true when the request is sent and set to false when the request is completed
  // or an error occurs
  const [loading, setLoading] = useState(false);
  // useRouter is a hook from Next.js that allows you to programmatically navigate
  // to different pages in your application
  // It is used here to redirect the user to the login page after successful registration
  const router = useRouter();

  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    // This is important to prevent the page from reloading
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${process.env.API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err);
        setLoading(false);
      } else {
        toast.success(data.success);
        router.push("/login");
      }

      //
    } catch (err) {
      // Log the error to the console for debugging purposes
      toast.error("Something went wrong. Please try again.");
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <main>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center vh-100">
          <div className="col-lg-5 shadow bg-light pd-5">
            <h2 className="mb-4 text-center">Register</h2>
            {/* Form for user registration */
            /* The form includes fields for name, email, and password */
            /* Each field has an onChange handler to update the state */
            /* The form submission is handled by the handleSubmit function */}

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control mb-4"
                placeholder="Please Enter Your Name"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control mb-4"
                placeholder="Please Enter Your Email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mb-4"
                placeholder="Please Enter Your Password"
              />
              <button
                className="btn btn-primary btn-raised"
                disabled={loading || !name || !email || !password}
              >
                {loading ? "Please Wait.." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
