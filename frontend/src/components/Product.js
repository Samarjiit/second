import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 productcard" style={{ minHeight: "430px" }}>
      <Link to={`/product/${product._id}/${product.user}`}>
        <Card.Text as="h6" id="prodcategory">
          {product.category}
        </Card.Text>
        <Card.Text as="div" id="prodcond">
          {product.condition}
        </Card.Text>
        <Card.Text as="div" id="homepgrating">
          <Rating value={product.rating} />
        </Card.Text>
        <Card.Img src={product.image} variant="top" id="prodimg" />
        <Card.Body>
          <Card.Title as="div" id="prodname">
            <strong>{product.name}</strong>
          </Card.Title>
          <Card.Footer id="cfooter">
            <Card.Text as="h6" id="prodprice">
              <strong>Rs. {product.price}</strong>
            </Card.Text>
          </Card.Footer>
        </Card.Body>
      </Link>
    </Card>
  );
};
//{product.uploaddate}
export default Product;
