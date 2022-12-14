import classes from "./BoardCell.module.css";
import { PlayerDetailsStore } from "../../context/PlayerStore.js";
import { CardStackStore } from "../../context/CardStore.js";
import { useEventCardStore } from "../../context/EventCardStore.js";
import { SocketStore } from "../../context/SocketStore.js";
import { PlayerListStore } from "../../context/PlayerListStore";
import { TurnTrackerStore } from "../../context/TurnTrackerStore.js";
import { useState } from "react";
///////////
import { useEffect } from "react";
import io from "socket.io-client";

// const socket = io.connect("https://pure-atoll-20271.herokuapp.com/");

////////////

function BoardCell(props) {
  const [Socket, setSocket] = SocketStore();
  const [
    playerOneImage,
    setPlayerOneImage,
    playerOne,
    setPlayerOne,
    playerTwo,
    setPlayerTwo,
    playerThree,
    setPlayerThree,
    playerFour,
    setPlayerFour,
    clientName,
    setClientName,
    clientPlayer,
    setClientPlayer,
  ] = PlayerDetailsStore();
  const [cardStack, setCardStack] = CardStackStore();
  const [eventCard, showEventCard] = useEventCardStore();
  const [playerList, setPlayerList] = PlayerListStore();
  const players = [playerOne, playerTwo, playerThree, playerFour];
  const playerSetting = [setPlayerOne, setPlayerTwo, setPlayerThree, setPlayerFour];

  const [
    currentTurn,
    setCurrentTurn,
    isTurn,
    setIsTurn,
    turnCounter,
    setTurnCounter,
  ] = TurnTrackerStore();
  ////////////////
  function boardChange() {
    setTurnCounter(turnCounter + 1);
    setCurrentTurn(playerList[turnCounter % playerList.length][0]);
    console.log(";) " + currentTurn);
    console.log("emmiting");
    Socket.emit("send_message", {
      message: "HelloYOYOYOYO",
      cellId: String(props.id),
      image: cardStack[0].image,
    });
  }
  ///////////////////////
  useEffect(() => {
    document.getElementById("turn").innerHTML =
      "It is currently " + currentTurn + "'s turn";
  }, [currentTurn]);

  function statSetter(index, value){
    console.log("setting")
    clientPlayer[index] = value;
    console.log(clientPlayer);
  }

  function playerFinder() {
    for (var i = 0; i < 4; i++) {
      if (players[i][5] == clientName) {
        return players[i];
      }
    }
  }

  function testFunction2(props) {
    console.log("the card stack is " + cardStack[0].name);
    statSetter(3, props.id)
    props.setActiveCell(props.id);
    props.setActiveCellImage(cardStack[0].image);
    props.setActiveCellName(cardStack[0].name);

    let id = props.id;
    console.log(id);
    document.getElementById(id).src = cardStack[0].image;
    console.log(cardStack);
    let playedCard = cardStack.slice(0, 1);
    console.log(playedCard);
    switch (playedCard[0].type) {
      case "cardEvent":
        let playerSet = playerFinder();
        showEventCard({
          type: "cardEvent",
          payload: {
            image: playedCard[0].image,
            type: cardStack[0].rollType,
            penalty: cardStack[0].penalty,
            button: cardStack[0].button,
            value: cardStack[0].value,
            player: clientPlayer,
            setPlayer: playerSet,
          },
        });
        break;
      case "drawEvent":
        showEventCard({
          type: "drawEvent",
          payload: {
            image: playedCard[0].image,
          },
        });
        break;
      case "busStation":
        showEventCard({
          type: "busStation",
          payload: {
            image: playedCard[0].image,
          },
        });
        break;
      case "statRoll":
        //document.getElementById("playerOne").innerHTML = "statRoll";
        break;
      default:
        //document.getElementById("playerOne").innerHTML = "Normal";
        break;
    }
    setCardStack(cardStack.slice(1));
    boardChange();
  }
  {console.log(clientName == currentTurn)}

  if (props.surround.includes(props.id) && clientName == currentTurn) {
    console.log("we are through!");
    console.log(props.canBePlaced);
    console.log(props.id);
    const index = props.surround.indexOf(props.id);
    const canBePlaced = props.canBePlaced[index];
    const style = canBePlaced ? "1px solid red" : null;
    if (style != null) {
      return (
        <td
          style={{
            outline: style,
            padding: "0px",
            margin: "0px",
            objectFit: "cover",
            lineHeight: "0",
          }}
        >
          <div
            className="square"
            style={{
              position: " relative",
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onClick={() => {
              testFunction2(props);
            }}
          >
            <img
              src="https://i.imgur.com/wrrKYfO.png"
              id={props.id}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            ></img>
            <div
              id={props.id + "player"}
              style={{
                position: "absolute",
                width: "10%",
                height: "10%",
                left: "50%",
                top: "50%",
              }}
            ></div>
          </div>
        </td>
      );
    }
  }

  if (props.id == 60) {
    return (
      <td
        className={classes.td}
        style={{ padding: "0px", margin: "0px", lineHeight: "0" }}
      >
        <div
          className="square"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        >
          <img
            src="https://i.imgur.com/wrrKYfO.png"
            id={props.id}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </td>
    );
  }

  return (
    <td
      style={{
        //border: "1px solid black",
        width: "50px",
        height: "50px",
        lineHeight: "0px",
        textAlign: "center",
        padding: "0px",
        margin: "0px",
      }}
    >
      <div className="square">
        <img
          src="https://i.imgur.com/wrrKYfO.png"
          id={props.id}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div
        id={props.id + "player"}
        style={{
          position: "absolute",
          width: "10%",
          height: "10%",
          left: "50%",
          top: "50%",
        }}
      ></div>
    </td>
  );
}

export default BoardCell;
