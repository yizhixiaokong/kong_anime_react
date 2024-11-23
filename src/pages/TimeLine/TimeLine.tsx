import React from "react";

const TimeLine: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <div
        style={{ width: "2px", height: "100vh", backgroundColor: "black" }}
      ></div>
    </div>
  );
};

export default TimeLine;
