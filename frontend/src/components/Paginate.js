import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  isSeller = false,

  keyword = "",
  itemsPerPage,
}) => {
  return (
    pages > 1 && (
      <Pagination className="justify-content-center my-3">
        <Pagination.First id="page" />
        <Pagination.Prev id="page" />
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              !isAdmin
                ? !isSeller
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}/${itemsPerPage}`
                  : `/seller/productlist/${x + 1}/${itemsPerPage}`
                : `/admin/productlist/${x + 1}/${itemsPerPage}`
            }
          >
            <Pagination.Item id="page" active={x + 1 === page}>
              {x + 1}
            </Pagination.Item>
          </LinkContainer>
        ))}
        <Pagination.Next id="page" />
        <Pagination.Last id="page" />
      </Pagination>
    )
  );
};

export default Paginate;
