import React, { useState } from "react";
import { MoreHorizontal } from "react-feather";

import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import Editable from "../Editabled/Editable";

import "./Board.css";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  // console.log(props.board)
  return (
    <div className="board">
      <div className="board_header">
        <h1 className="board_header_title">
          {props.board?.title||props.board?.board_title}
          {" ( "}<span>{props.board?.cards?.length || 0}</span>{" )"}
        </h1>
        <div
          className="board_header_title_more"
          onClick={() => setShowDropdown(true)}
        > 
          <MoreHorizontal />
          {showDropdown && (
            <Dropdown
              class="board_dropdown"
              onClose={() => setShowDropdown(false)}
            >
              <p onClick={() => props.removeBoard()}>Delete Board</p>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="board_cards custom-scroll">
        {props.board?.cards?.map((item, index) => (
          <Card
            boardIndex = {props.index}
            index={index}
            key={item.boardId}
            card={item}
            boardId={props.board.boardId}
            removeCard={props.removeCard}
            dragEntered={props.dragEntered}
            dragEnded={props.dragEnded}
            updateCard={props.updateCard}
          />
        ))}
        <Editable
          text="+ Add Card"
          placeholder="Enter Card Title"
          displayClass="board_add-card"
          editClass="board_add-card_edit"
          onSubmit={(value) => props.addCard(props.board?.boardId, value)}
        />
      </div>
    </div>
  );
}

export default Board;
