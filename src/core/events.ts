let subscribers = new Map();

export function subscribe(subscriber: (text: string) => void): () => void {
  const key = `${Date.now()}${Math.random()}`;
  subscribers.set(key, subscriber);

  return () => {
    subscribers.delete(key);
  }
}

export function emit(text: string): void {
  for (const subscriber of subscribers.values()) {
    subscriber(text);
  }
}