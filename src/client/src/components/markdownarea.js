import React, { useState, useEffect } from "react";
import Split from "react-split";
import MarkdownPreview from "./markdownpreview";

function MarkdownArea(props) {
  const [orientation, setOrientation] = useState("horizontal");

  useEffect(() => {
    let changeOrientation = () => {
      setOrientation(window.innerWidth < 600 ? "vertical" : "horizontal");
    };
    changeOrientation();
    window.onresize = changeOrientation;
  }, []);

  return (
    <div className="work-area">
      <Split
        className="wrapper-card"
        sizes={[50, 50]}
        minSize={orientation === "horizontal" ? 300 : 100}
        expandToMin={true}
        gutterAlign="center"
        direction={orientation}
      >
        
        <MarkdownPreview content={props.content} />
      </Split>
    </div>
  );
}

export default MarkdownArea;
