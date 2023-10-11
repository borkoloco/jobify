import { redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ params }) => {
  //   console.log(params);
  //   return null;
  // };
  try {
    await customFetch.delete(`/jobs/${params.id}`);
    toast.success("Job deleted successfully");
  } catch (error) {
    toast.error(error.response.data.msg);
  }
  return redirect("/dashboard/all-jobs");
};

// const DeleteJob = () => {
//   return <h1>DeleteJob Page</h1>;
// };

// export default DeleteJob;
//no hace falta el componente ya que no hay nada que renderizar
