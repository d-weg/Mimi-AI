import { client, publisher, subscriber } from "@redis";
import { EventSchemas } from "@shared/schemas/Events";
import { Events } from "@shared/types/Events";
import { z } from "zod";

type EventMap = { [K in Events]: z.infer<(typeof EventSchemas)[K]> };
type EventCallback<T = any> = (data: T) => void | Promise<void>;

class EventBus {
  private static instance: EventBus;
  private handlers: Map<Events, Set<EventCallback>> = new Map();
  private readonly maxListeners: number = 10;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
      EventBus.instance.init();
    }
    return EventBus.instance;
  }

  private async init() {
    if (this.isInitialized) return;

    try {
      await subscriber.connect();
      const handleMessage = this.handleMessage.bind(this);
      const handleError = this.handleError.bind(this);

      subscriber.on("message", handleMessage);
      subscriber.on("error", handleError);

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize EventBus:", error);
      throw error;
    }
  }

  private async handleMessage(channel: string, message: string) {
    try {
      const parsedData = JSON.parse(message);
      const eventHandlers = this.handlers.get(channel as Events);

      if (!eventHandlers) return;

      const schema = EventSchemas[channel as Events];
      if (schema) {
        const result = schema.safeParse(parsedData);
        if (!result.success) {
          this.handleError(
            new Error(
              `Invalid event data for ${channel}: ${JSON.stringify(
                result.error.format()
              )}`
            )
          );
          return;
        }
      }

      await Promise.allSettled(
        Array.from(eventHandlers).map((handler) =>
          Promise.resolve().then(() => handler(parsedData))
        )
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown) {
    console.error("EventBus error:", error);
    // Implement your error reporting logic here
  }

  // Type-safe subscribe method
  subscribe<E extends Events>(
    event: E,
    callback: EventCallback<EventMap[E]>
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
      subscriber.subscribe(event).catch(this.handleError.bind(this));
    }

    const handlers = this.handlers.get(event)!;

    // Check for max listeners
    if (handlers.size >= this.maxListeners) {
      this.handleError(
        new Error(
          `Max listeners (${this.maxListeners}) exceeded for event ${event}`
        )
      );
    }

    handlers.add(callback);

    // Return unsubscribe function
    return () => this.unsubscribe(event, callback);
  }

  // Type-safe publish method
  async publish<E extends Events>(event: E, data: EventMap[E]): Promise<void> {
    try {
      const schema = EventSchemas[event];

      if (schema) {
        const result = schema.safeParse(data);
        if (!result.success) {
          throw new Error(
            `Invalid data for event ${event}: ${JSON.stringify(
              result.error.format()
            )}`
          );
        }
      }

      await publisher.publish(event, JSON.stringify(data));
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // New method to unsubscribe
  private unsubscribe<E extends Events>(
    event: E,
    callback: EventCallback<EventMap[E]>
  ): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.delete(callback);

      // Cleanup if no handlers left
      if (handlers.size === 0) {
        this.handlers.delete(event);
        subscriber.unsubscribe(event).catch(this.handleError.bind(this));
      }
    }
  }

  // New method to clear all subscriptions
  async clear(): Promise<void> {
    try {
      for (const event of this.handlers.keys()) {
        await subscriber.unsubscribe(event);
      }
      this.handlers.clear();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Getter for testing purposes
  getSubscribersCount(event: Events): number {
    return this.handlers.get(event)?.size ?? 0;
  }
}

// Export as readonly to prevent modification
export const eventBus = Object.freeze(EventBus.getInstance());
