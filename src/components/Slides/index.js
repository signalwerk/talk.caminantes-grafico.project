import { useState, useEffect, useCallback } from "react";
import fm from "front-matter";
import Slide from "../Slide";
import { replaceVars } from "./replaceVars";
import { get } from "lodash";
import useHash from "../../hooks/useHash";
import useKeypress from "../../hooks/useKeyPress";

function extractFrontMatter(str) {
  let attributes = {};
  let body = str;

  try {
    const md = str.replaceAll("```fm", "---").replace("```", "---");
    console.log({ md });
    const frontmatter = fm(md);

    attributes = get(frontmatter, "attributes");
    body = get(frontmatter, "body");
  } catch (e) {
    console.log(e);
  }

  return { attributes, body };
}

function slide2html(str) {
  const { attributes, body } = extractFrontMatter(str);
  return { attributes, body };
}

function md2slides(str) {
  const content = replaceVars((str || "").trim());

  const globalSlides = extractFrontMatter(content);

  const slides = globalSlides.body
    .trim()
    .split("--s--")
    .map((slide) => slide.trim())
    // .filter((slide) => slide)
    .map((slide, index) => {
      const finalSlide = slide2html(slide);

      return {
        id: `slide${index}`,
        index,
        // raw: slide,
        slide: {
          ...(globalSlides.attributes.slide || {}),
          ...finalSlide.attributes,
          // body: finalSlide.body,
          raw: finalSlide.body,
        },
        // global: { attributes },
      };
    });

  return slides;
}

function getIndexFromHash(hash) {
  return (
    parseInt(hash?.substring(1)?.match(/\/([^\/]+)\/?$/)?.[1] || 0, 10) || 0
  );
}
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function Component({ md }) {
  const [hash, setHash] = useHash();
  const [select, setSelect] = useState(getIndexFromHash(hash));

  const slides = md2slides(md);
  const count = Math.max(0, slides.length - 1);

  useEffect(() => {
    console.log("hash effect");

    const parsed = getIndexFromHash(hash);

    if (parsed !== select) {
      console.log("set select", parsed, select);
      setHash(`#/${select}`);
    }
  }, [hash, select]);

  useKeypress("ArrowRight", () => {
    setSelect((parsed) => clamp(parsed + 1, 0, count));
  });

  useKeypress("ArrowLeft", () => {
    setSelect((parsed) => clamp(parsed - 1, 0, count));
  });

  useKeypress("PageUp", () => {
    setSelect((parsed) => clamp(parsed + 1, 0, count));
  });

  useKeypress("PageDown", () => {
    setSelect((parsed) => clamp(parsed - 1, 0, count));
  });

  return (
    <div className="Slides">
      {/* <h1>select:{select}</h1> */}

      <Slide data={slides[clamp(select, 0, count)]} />

      {/* <br></br>
      <br></br>

      {slides.map((slide) => (
        <Slide key={slide.id} data={slide} />
      ))} */}
    </div>
  );
}

export default Component;
