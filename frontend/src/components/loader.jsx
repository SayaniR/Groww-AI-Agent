import React from "react";
import { Progress } from "antd";

const Loader = ({
  percent = "auto",
  size = 80,
}) => {
  return (
    <div
      className="groww-loader"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "100%",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Progress
        type="circle"
        percent={percent}
        size={size}
        strokeColor="#00D09C"
        trailColor="#E5E7EB"
        strokeWidth={6}
        showInfo={false}
      />
    </div>
  );
};

export default Loader;