import { SocketStoreProvider } from "../context/SocketStore.js";
import { PlayerDetailsStoreProvider } from "../context/PlayerStore.js";
import { CardStackStoreProvider } from "../context/CardStore.js";
import { EventCardStoreProvider } from "../context/EventCardStore.js";
import { EventStoreProvider } from "../context/EventStore.js";
import { CardTriggerProvider } from "../context/CardTrigger.js";
import { ItemStoreProvider } from "../context/ItemStore.js";
import { ActiveCellStoreProvider } from "../context/ActiveCellStore.js";
import { TestStoreProvider } from "../context/TestStore.js";
import { PlayerListStoreProvider } from "../context/PlayerListStore.js";
import { CameraReducerProvider } from "../context/CameraReducer.js";
import { TurnTrackerStoreProvider } from "../context/TurnTrackerStore.js";
import "../styles/globals.css";
import 'bootstrap/dist/css/bootstrap.css'

function MyApp({ Component, pageProps }) {
  return (
    <TurnTrackerStoreProvider>
    <CameraReducerProvider>
      <SocketStoreProvider>
        <PlayerListStoreProvider>
          <TestStoreProvider>
            <ActiveCellStoreProvider>
              <ItemStoreProvider>
                <CardTriggerProvider>
                  <CardStackStoreProvider>
                    <PlayerDetailsStoreProvider>
                      <EventStoreProvider>
                        <EventCardStoreProvider>
                          <Component {...pageProps} />
                        </EventCardStoreProvider>
                      </EventStoreProvider>
                    </PlayerDetailsStoreProvider>
                  </CardStackStoreProvider>
                </CardTriggerProvider>
              </ItemStoreProvider>
            </ActiveCellStoreProvider>
          </TestStoreProvider>
        </PlayerListStoreProvider>
      </SocketStoreProvider>
    </CameraReducerProvider>
    </TurnTrackerStoreProvider>
  );
}
export default MyApp;
