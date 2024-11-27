import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
} from "@chakra-ui/react";

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Fout bij het ophalen van evenement");
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Fout bij het ophalen van evenement:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Fout bij het verwijderen van evenement");
      }
      navigate("/");
    } catch (error) {
      console.error("Fout bij het verwijderen van evenement:", error);
    }
  };

  if (!event) {
    return <p>Evenement wordt geladen...</p>;
  }

  return (
    <div>
      {/* Terug naar Home knop */}
      <Button colorScheme="gray" onClick={() => navigate("/")} mb="4">
        Terug naar Home
      </Button>

      <h1>{event.title}</h1>
      <img
        src={event.image}
        alt={event.title}
        style={{ maxWidth: "600px", width: "100%" }}
      />
      <p>{event.description}</p>
      <p>Locatie: {event.location}</p>
      <p>Starttijd: {new Date(event.startTime).toLocaleString()}</p>
      <p>Eindtijd: {new Date(event.endTime).toLocaleString()}</p>

      {/* Bewerken knop */}
      <Button
        colorScheme="blue"
        onClick={() => navigate(`/event/edit/${eventId}`)}
        mt="4"
      >
        Bewerken
      </Button>

      {/* Verwijderen knop */}
      <Button colorScheme="red" onClick={onOpen} mt="4" ml="4">
        Verwijderen
      </Button>

      {/* Verwijder Bevestigingsmodal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bevestig Verwijderen</ModalHeader>
          <ModalBody>
            <Text>Weet je zeker dat je dit evenement wilt verwijderen?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDelete}>
              Verwijderen
            </Button>
            <Button colorScheme="gray" onClick={onClose} ml="3">
              Annuleren
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EventDetail;
