import { useState, useEffect, useCallback } from "react";
import fm from "front-matter";
import Slide from "../Slide";
import { processMD } from "./gfm";
import useAsync from "../../hooks/useAsync";

function Component({ data }) {
  //   const { value, loading, error } = useAsync(processMD, [data.slide.raw]);
  //   const state = useAsync(() => fetch(url).text(), [url])

  const { value, loading, error } = useAsync(async () => {
    const result = await processMD(data.slide.raw);
    return result;
  }, [data?.slide?.raw]);

  if (loading) return null;
  if (error)
    return (
      <div>
        <p>There is an error in slide ##.</p>{" "}
        <pre>{("obj", JSON.stringify(data, null, 2))}</pre>
      </div>
    );

  return (
    <div className="Slide">
      <div className="slide__md" dangerouslySetInnerHTML={{ __html: value }} />

      <pre>{("obj", JSON.stringify(data, null, 2))}</pre>
    </div>
  );
}

export default Component;
