import React from "react";
import { Helmet } from "react-helmet";
const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};
Meta.defaultProps = {
  title: "2ndChance | Home",
  description: "Give your products a second chance!",
  keywords: "second-hand, hostel, cheap products",
};
export default Meta;
