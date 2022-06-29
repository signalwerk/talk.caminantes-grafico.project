import Slides from "./components/Slides";
import useFetch from "./hooks/useFetch";

import "./App.css";

const url = `/slide.md`;

function App() {
  const { response, loading, error } = useFetch(url);
  if (error) return <p>There is an error.</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="App">
      <Slides md={response}></Slides>
    </div>
  );
}

export default App;
