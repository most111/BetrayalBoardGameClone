import { PlayerListStore } from "../context/PlayerListStore";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { SocketStore } from "../context/SocketStore";

//const socket = io.connect("https://mighty-brushlands-84806.herokuapp.com/");
// const socket = io.connect("http://localhost:3001", {
//   reconnection: true,
//   reconnectionAttempts: Infinity,
// });
////////////

function RoomPage(props) {
  const [Socket, setSocket] = SocketStore();
  const testList = useRef([]);
  const router = useRouter();
  const [playerList, setPlayerList] = PlayerListStore();
  let roomCode = router.query.roomID;

  //on client load, get list of players
  function initialEmit() {
    if (String(router.query.host) == "true") {
      testList.current = [String(router.query.name)]; //create reference with host name in array
    }
    if (String(router.query.host) == "false") {
      //client asks host to server for list of players
      Socket.emit("initialRoomReq", {
        name: router.query.name,
        roomID: router.query.roomID,
      });
    }
  }

  //makes initial emit only run once
  useEffect(() => {
    let ignore = false;
    if (!ignore) initialEmit();
    return () => {
      ignore = true;
    };
  }, []);

  //host gets request for list of players and sends to server
  useEffect(() => {
    if (router.query.host == "true") {
      Socket.on("initalRoomReqHost", (data) => {
        setPlayerListFunc(data.name); //add name to list
      });
    }
  }, [Socket]);

  //server sends list of players back to client
  useEffect(() => {
    if (router.query.host == "false") {
      Socket.on("initialRoomRes", (data) => {
        console.log("respones from host recieved: " + data.lobbyList);
        setPlayerListFuncAll(data.lobbyList); //set playerList to the updated list
      });
    }
  }, [Socket]);

  //when the host player list changed, update other clients with new list
  useEffect(() => {
    if (router.query.host == "true") {
      updatePlayerList();
    }
  }, [playerList]);

  //set new player List
  function setPlayerListFunc(newPlayer) {
    const tempArray = testList.current;
    tempArray.push(newPlayer);
    setPlayerList(tempArray); //this triggers the useEffect above
  }

  //set new player List for the client
  function setPlayerListFuncAll(list) {
    if (router.query.host == "false") {
      let tempArray = playerList.slice(0);
      tempArray = list.slice(0);
      setPlayerList(tempArray);
    }
  }

  Socket.emit("startRoom", {
    roomID: String(router.query.roomID),
  });

  //host sends player list to clients
  function updatePlayerList() {
    testList.current = playerList.slice(0); //save the shallow playerList to testList reference, (needs to be sliced for shallow copy otherwise it will be a reference to the playerList)
    Socket.emit("initialRoomResHost", {
      lobbyList: playerList,
      roomID: router.query.roomID,
    });
  }

  ////////////////
  useEffect(() => {
    Socket.on("roomStart", (data) => {
      roomCode = data.roomID;
    });
  }, [Socket, roomCode]);

  function startGame() {
    if (router.query.host == "true") {
      Socket.emit("gameStart", {
        roomID: roomCode,
      });
      router.push({ pathname: "/gamePage", query: { roomID: roomCode } });
    }
  }
  useEffect(() => {
    Socket.on("startGameClient", (data) => {
      router.push({ pathname: "/gamePage", query: { roomID: roomCode } });
    });
  });

  let messageContainer = null;

    function appendMessage(message){
      const messageElement = document.createElement('div')
      messageElement.innerText = message
      console.log(messageContainer)
      messageContainer.append(messageElement)
    }

    useEffect (() => {
      Socket.on("chat-message", (data) => {
        console.log("hello, chat-message recieved")
        appendMessage(data)
      })
    }, [Socket])

    useEffect (() => {
      Socket.on("userConnected", (data) => {
        appendMessage(data.name + " joined.")
      })
    }, [Socket])

    useEffect(() => {
      console.log("chat initalized")
      const messageForm = document.getElementById("send-container");
      const messageInput = document.getElementById("message-input");
      messageContainer = document.getElementById("message-container");
  
      messageForm.addEventListener("submit", e => {
        e.preventDefault()
        const message = messageInput.value
        Socket.emit("sendChatMessage", {
          message: message,
          roomID: roomCode,
          name: router.query.name,
        })
        appendMessage("You: " + message)
        messageInput.value = ""
      })}, []);

  return (
    <div>
      <div style={{ position: "absolute", left: "49%", top: "5%" }}>
        Lobby, socket id: {Socket.id}
      </div>
      <div style={{ position: "absolute", left: "49%", top: "10%" }}>
        Lobby code: {roomCode}
      </div>
      <div style={{ position: "absolute", left: "19%", top: "20%" }}>
        Players in Lobby:
        <ul>
          {playerList.map((player) => {
            return <li key={player + "test"}>{player}</li>;
          })}
        </ul>
      </div>
      <div style={{ position: "absolute", left: "70%", top: "50%" }}>
        <div id="message-container"></div>
        <form id="send-container">
          <input type="text" id="message-input"></input>
          <button type="submit" id="send-button">
            Send
          </button>
        </form>
      </div>
      <button
        onClick={startGame}
        style={{ position: "absolute", left: "49%", top: "50%" }}
      >
        Start
      </button>
    </div>
  );
  
}

export default RoomPage;