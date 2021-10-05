import React, { useState, useEffect } from "react";
import * as marked from "marked";
import Prism from "prismjs"; //css for Prism is imported in ThemeSelector
import "../ultilities/prism-imports";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Tooltip } from "@material-ui/core";

function MarkdownPreview({ content }) {
  const [html, setHtml] = useState(getHtml(content));
  const handle = useFullScreenHandle();

  useEffect(() => {
    Prism.highlightAll();
  });

  useEffect(() => {
    setHtml(getHtml(content));
  }, [content]);

  const handleFullScreen = () =>
    handle.active ? handle.exit() : handle.enter();

  return (
    <div className="markdown-preview scroll">
      <div className="section-title">
        <div className="right-section">
          <Tooltip title="FullScreen">
            <button className="btn" onClick={handleFullScreen}>
            </button>
          </Tooltip>
        </div>
      </div>
      <FullScreen handle={handle} >
        <div
          style={{whiteSpace: 'pre-line'}}
          id="preview"
          className={`html-div ${handle.active ? "preview-fullscreen" : ""}`}
          dangerouslySetInnerHTML={{ __html: html }}></div>
      </FullScreen>
    </div>
  );
}

const getHtml = (markdown) => {
    console.log(markdown)
  return marked(markdown);
};

export default MarkdownPreview;
