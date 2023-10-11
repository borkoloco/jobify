import { Form, redirect, Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import customFetch from "../utils/customFetch.js";
import { FormRow, Logo, SubmitBtn } from "../components";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  // console.log(formData);
  // return null;
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/register", data);
    // return null;
    toast.success("Registration successful");
    return redirect("/login");
  } catch (error) {
    // console.log(error);
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Register = () => {
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow name="name" type="text" />
        <FormRow name="lastName" type="text" labelText="last name" />
        <FormRow name="location" type="text" />
        <FormRow name="email" type="email" />
        <FormRow name="password" type="password" />
        <SubmitBtn />
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Register;
