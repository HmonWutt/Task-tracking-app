import { useEffect, useState } from "react";

const Lastdoneretriver = () => {
  const [lastdone, setlastdone] = useState("");
  console.log("component renders")
  const Retrievelastdone = async () => {
    try {
      const response = await fetch(`http://192.168.0.6:3000/todo/bedsheet`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      let retrievedlastdone = await response.json();
      setlastdone(retrievedlastdone);
      console.log("retrieved and updated lastdone", retrievedlastdone);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    Retrievelastdone();
  });

  return (
    <div>
      {lastdone ? (
        <div className="m-3">last done: {lastdone}</div>
      ) : (
        <div>No last done data available</div>
      )}
    </div>
  );
};

export default Lastdoneretriver;
