
import React, { useState } from "react";

function ImageFrame({prompt, image}) {
  return (
    <div>
          <div className="card-header">
            <h4 className="card-title">Generated image for: {prompt}</h4>
          </div>
          <div className="card-body">
            <img
              src={image}
              className="img-fluid"
              alt={`Image for ${prompt}`}
            />
          </div>
        </div>
  );
}

export default ImageFrame;