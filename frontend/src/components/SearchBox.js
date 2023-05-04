import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, InputGroup } from "react-bootstrap";

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
    setKeyword("");
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <InputGroup className="mb-1">
        <Form.Control
          type="text"
          name="q"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search Products..."
          className="mr-sm2 ml-sm-5"
          id="s"
        ></Form.Control>
        <Button type="submit" className="p-1.5" id="search">
          Search
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;
