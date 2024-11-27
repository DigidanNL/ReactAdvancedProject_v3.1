import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const EditEventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/categories.json");
        if (!response.ok) {
          throw new Error("Fout bij het ophalen van de categorieën");
        }
        const data = await response.json();
        // Haal unieke categorieën uit de categorieënlijst in de JSON
        const uniqueCategories = data.categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
        }));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Fout bij het ophalen van de categorieën:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch("/events.json");
        if (!response.ok) throw new Error("Fout bij het ophalen van evenement");
        const data = await response.json();
        const foundEvent = data.events.find((e) => e.id === parseInt(eventId));
        if (!foundEvent) throw new Error("Evenement niet gevonden");
        setEvent({
          ...foundEvent,
          startTime:
            formatDateTimeLocal(foundEvent.startTime) || "2023-12-01T19:00",
          endTime:
            formatDateTimeLocal(foundEvent.endTime) || "2023-12-01T22:00",
        });
      } catch (error) {
        console.error("Fout bij het ophalen van evenement:", error);
        toast({
          title: "Fout",
          description: "Het evenement kon niet worden geladen.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchEvent();
  }, [eventId, toast]);

  const formatDateTimeLocal = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16);
  };

  const handleSave = async () => {
    try {
      console.log("Bewerkte evenement opgeslagen:", event);
      toast({
        title: "Evenement opgeslagen.",
        description: "De wijzigingen zijn succesvol opgeslagen.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error("Fout bij het opslaan van het evenement:", error);
      toast({
        title: "Fout bij opslaan.",
        description: "Er is iets misgegaan bij het opslaan van de wijzigingen.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    toast({
      title: "Bewerking geannuleerd.",
      description: "De wijzigingen zijn niet opgeslagen.",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    navigate(`/event/${eventId}`);
  };

  const handleDelete = () => {
    onOpen();
  };

  const confirmDelete = () => {
    // Hier kun je de logica toevoegen om het evenement te verwijderen
    toast({
      title: "Evenement verwijderd.",
      description: "Het evenement is succesvol verwijderd.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
    navigate("/");
  };

  if (!event) {
    return <p>Evenement wordt geladen...</p>;
  }

  return (
    <Box padding="4" maxWidth="600px" margin="0 auto">
      <FormControl mb="4">
        <FormLabel>Titel</FormLabel>
        <Input
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Beschrijving</FormLabel>
        <Input
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Starttijd</FormLabel>
        <Input
          type="datetime-local"
          value={event.startTime}
          onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Eindtijd</FormLabel>
        <Input
          type="datetime-local"
          value={event.endTime}
          onChange={(e) => setEvent({ ...event, endTime: e.target.value })}
        />
      </FormControl>
      <FormControl mb="4">
        <FormLabel>Categorie</FormLabel>
        <Select
          placeholder="Selecteer een categorie"
          value={event.categories.length > 0 ? event.categories[0].id : ""}
          onChange={(e) => {
            const selectedCategory = categories.find(
              (cat) => cat.id === parseInt(e.target.value)
            );
            if (selectedCategory) {
              setEvent({
                ...event,
                categories: [
                  {
                    id: selectedCategory.id,
                    name: selectedCategory.name,
                  },
                ],
              });
            }
          }}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Button colorScheme="blue" onClick={handleSave} mt="4">
        Opslaan
      </Button>
      <Button colorScheme="gray" onClick={handleCancel} mt="4" ml="4">
        Annuleren
      </Button>
      <Button colorScheme="red" onClick={handleDelete} mt="4" ml="4">
        Verwijderen
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bevestig Verwijderen</ModalHeader>
          <ModalBody>
            Weet u zeker dat u dit evenement wilt verwijderen? Deze actie kan
            niet ongedaan gemaakt worden.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmDelete} mr={3}>
              Verwijderen
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Annuleren
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EditEventPage;
