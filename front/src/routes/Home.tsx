import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div>
        <h1>
          Go to the
          <Link to="/todos"> todos</Link>
        </h1>
      </div>
    </>
  );
}

export default Home;
