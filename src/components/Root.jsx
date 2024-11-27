import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Navigation from "./Navigation";

const Root = () => {
  return (
    <Box>
      <Navigation />
      <Outlet />
    </Box>
  );
};

export default Root;
