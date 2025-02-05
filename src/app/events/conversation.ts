import { eventBus } from "@redis/event";
import { Events } from "@shared/types/Events";

eventBus.subscribe<Events.CONVERSATION_START>(
  Events.CONVERSATION_START,
  (data) => {
    eventBus.subscribe<Events.CONVERSATION_MESSAGE>(
      Events.CONVERSATION_MESSAGE,
      (data) => {
        console.log(data);
      }
    );
  }
);
