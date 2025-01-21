import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const SignedInPage = (props) => {
  const userSelector = useSelector((state) => state.user);

  if (!userSelector.id) {
    return <Navigate to="/" />;
  }

  return props.children;
};
