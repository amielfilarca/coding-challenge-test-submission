import React from "react";
import $ from "./ErrorMessage.module.css";

type Props = {
  children: React.ReactNode;
};

const ErrorMessage = ({ children }: Props) => {
  return <div className={$.error}>{children}</div>;
};

export default ErrorMessage;
