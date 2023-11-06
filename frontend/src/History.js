
import React from "react";
import { Container} from 'react-bootstrap';
import ImageFrame from './ImageFrame.js'


function ImageGenFormList({ items }) {
  // let str = JSON.stringify(items);
  const itemsCopy = items.slice();

  return (
    <Container className="text-center">
      <h3 className="mt-4">History</h3>

      {/* Generates image for each item passed to history tab.*/}
      {items.length === 0 ? (
        <p>No records to show</p>
      ) : (
        itemsCopy.reverse().map((row, index) => (
          <div key={index} className="card mb-3">
            <ImageFrame prompt={row.prompt} key={index} image={row.image}></ImageFrame>
          </div>
        ))
      )}
    </Container>
  );
}

export default ImageGenFormList;