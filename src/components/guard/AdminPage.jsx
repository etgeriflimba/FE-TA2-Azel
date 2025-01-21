import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AdminPage = (props) => {
  const userSelector = useSelector((state) => state.user);

  if (userSelector.role !== "Admin") {
    return <Navigate to="/" />;
  }

  return props.children;
};
