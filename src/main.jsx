import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import EventsPage from "./pages/EventsPage";
import EditEventPage from "./pages/EditEventPage";
import EventDetail from "./pages/EventDetail"; // Nieuwe detailpagina toevoegen
import Root from "./components/Root";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
      },
      {
        path: "event/:eventId",
        element: <EventDetail />, // Detailcomponent, dit zou correct moeten zijn
      },
      {
        path: "event/edit/:eventId",
        element: <EditEventPage />, // Bewerkingspagina, lijkt goed
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
