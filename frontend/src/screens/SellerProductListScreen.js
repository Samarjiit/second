import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pageNumber } = useParams() || 1;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (userInfo && userInfo.isSeller) {
      dispatch(listProducts("", ""));
    } else {
      navigate("/login");
    }
    if (successCreate && userInfo.isSeller) {
      navigate(`/seller/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts("", pageNumber));
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };
  const createProductHandler = (product) => {
    dispatch(createProduct());
  };

  return (
    <>
      <Meta title="2nd Chance | Seller" />
      <Row className="align-items-center">
        <Col>
          <h4>Products</h4>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Add Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="light">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="light">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="light">{error}</Message>
      ) : (
        <>
          <Table bordered hover responsive className="table-sm" id="order">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((product) => product.user === userInfo._id)
                .map((product) => (
                  <tr key={product._id}>
                    <td>{product._id.substring(21, 24)}</td>
                    <td>{product.name}</td>
                    <td>Rs. {product.price}</td>
                    <td>{product.countInStock}</td>
                    <td> {product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      {userInfo && userInfo.isSeller && (
                        <LinkContainer
                          to={`/seller/product/${product._id}/edit`}
                        >
                          <Button variant="light" className="btn-sm">
                            <i className="fas fa-edit"></i>
                          </Button>
                        </LinkContainer>
                      )}
                      &nbsp;
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isSeller={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
