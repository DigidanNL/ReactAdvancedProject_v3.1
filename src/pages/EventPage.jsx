import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

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

  if (!event) {
    return <p>Evenement wordt geladen...</p>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <img src={event.image} alt={event.title} />
      <p>{event.description}</p>
      <p>Locatie: {event.location}</p>
      <p>Starttijd: {new Date(event.startTime).toLocaleString()}</p>
      <p>Eindtijd: {new Date(event.endTime).toLocaleString()}</p>
    </div>
  );
};

export default EventPage;
