import { observable } from "@legendapp/state";
import { configureObservablePersistence } from "@legendapp/state/persist";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { Session } from "@/lib/types/session.types";

// Configure Legend State persistence
configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

// Create the session state
export const sessionState = observable<Session>({});
