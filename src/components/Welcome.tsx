import { useState } from "react";
import axios from "axios";

const Welcome = () => {
  const [greeting, setGreeting] = useState("Regular greeting");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/your-endpoint"
      );
      console.log(response.data);
      setGreeting(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    // <Authenticator>
    // {({ signOut, user }) => (
    <main>
      <h1>{greeting}</h1>
      <button onClick={fetchData}>Replace greeting</button>
    </main>
    // )}
    // </Authenticator>
  );
};

export default Welcome;
