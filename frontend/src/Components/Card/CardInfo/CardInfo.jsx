import React, { useEffect, useState, useRef } from "react";
import io from 'socket.io-client';
// import "./Client.js"


import { supabase } from "../../../Supabaseclient";
import {
  User,
  Calendar,
  CheckSquare,
  List,
  Tag,
  Trash,
  Type,
  X,
  Users,
} from "react-feather";
import Chatmodal from "../../../chat-window/Chatmodal";
import Modal from "../../Modal/Modal";
import Editable from "../../Editabled/Editable";

import "./CardInfo.css";
import Collaborate from "../../collaborate/Collaborate";


function CardInfo(props) {
  
  // const [boards, setBoards] = useState(
    //   JSON.parse(localStorage.getItem("prac-kanban")) || []
    //     );
    const [boards, setBoards] = useState();
    // console.log(boards)
    let userDetails = {};
    let userEmail = "";
    let userName = "";
    const retrieveUser = async() =>{
      const { data: { user } } = await supabase.auth.getUser()
      userDetails = user;
      userName = user.user_metadata.full_name;
      userEmail = user.user_metadata.email;
      }
      
      useEffect(()=>{
          retrieveUser();
          const tempBoards =  JSON.parse(localStorage.getItem("prac-kanban"));
          setBoards(tempBoards);
        },[])
      // console.log(boards)

      // console.log((typeof boards === undefined)+ "     " +boards)


      // if(!(typeof (boards )=== "undefined"))
      //   {
      //     console.log(boards);
      // console.log(boards[0].cards[0].tasks)
      //   }
   


  // const [username, setUsername] = useState("");
  // const [userDetails, setUserDetails] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  // const joinRoom = async() => {

  //   const { data: { user } } = await supabase.auth.getUser()

  //   setUsername(user.user_metadata.full_name)
  //   values && setRoom(values.cardId);

  //   if (username !== "" && room !== "") {
  //     socket.emit("join_room", room);
  //     setShowChat(true);
  //   }
  // };

  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const messageInputRef = useRef(null);
  const [messages, setMessages] = useState([]); // State for holding the current message

  const toggleOverlay = () => {
    setIsChatModalOpen(!isChatModalOpen);
  };


  const colors = [
    "#a8193d",
    "#4fcc25",
    "#1ebffa",
    "#8da377",
    "#9975bd",
    "#cf61a1",
    "#240959",
  ];

// console.log(props.cardIndex);

  const [selectedColor, setSelectedColor] = useState();
  const [values, setValues] = useState({
    ...props.card,
  });
  // console.log(values);
// const [index, setIndex]=useState(props.cardIndex || -1)

  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  const updateDesc = (value) => {
    setValues({ ...values, desc: value });
  };

  const addLabel = (label) => {
    const index = values.labels.findIndex((item) => item.text === label.text);
    if (index > -1) return;

    setSelectedColor("");
    setValues({
      ...values,
      labels: [...values.labels, label],
    });
  };

  const removeLabel = (label) => {
    const tempLabels = values.labels.filter((item) => item.text !== label.text);

    setValues({
      ...values,
      labels: tempLabels,
    });
  };
//-------------------------------------------------------
  const addsubtaskhandler = async(title) => {
    try {
        // const tempBoards = [...boards];
        // const boardIndex = tempBoards.findIndex(board => board.boardId === props.card.board_id);
        // const cardIndex = tempBoards[boardIndex].cards.findIndex(card => card.cardId === props.card.cardId);

        let subtaskId = Date.now() + Math.random() * 2;
        subtaskId = subtaskId.toFixed(1);
        subtaskId = subtaskId * 10;
        // console.log(subtaskId);

        const newSubtask = {
            cardId: values.cardId,
            card_title: values.title?values.title:values.card_title, 
            subtaskId: subtaskId,
            subtask_title: title,
            isCompleted: false,
            isDeleted:false,
        };
        

        console.log('subtask => ', newSubtask);

        const response = await fetch('http://localhost:5000/api/createSubtask', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newSubtask)
        });

        const json = await response.json();
        if (json.success) {
          const updatedTasks = [...values.tasks, newSubtask];
          boards[props.boardIndex].cards[props.cardIndex].tasks = updatedTasks;
          setBoards(boards);
          localStorage.setItem("prac-kanban", JSON.stringify(boards));
            setValues({
              ...values,
              tasks: updatedTasks,
            });
          props.updateCard(boards[props.boardIndex].boardId,boards[props.boardIndex].cards[props.cardIndex].cardId , boards[props.boardIndex].cards[props.cardIndex])
          console.log("subtask added");
          alert('Subtask added');
        } else {
            console.log(json.error);
        }
    } catch (error) {
        console.log(error);
    }
};

  const addTask = (value) => {
    setValues({
      ...values,
      tasks: [...values.tasks, value],
    });
  };

  const removeTask = async (id) => {

    try {

      const response = await fetch("http://localhost:5000/api/deleteSubtask", {
        method:"POST", 
        headers:{
          "Content-Type": "application/json"
        },
        body:JSON.stringify({
          subtaskId: id,
        })
      })
      const json = await response.json();

      if(json.success)
        {
          const tempBoards = [...boards];
          const boardIndex = tempBoards.findIndex(board => board.boardId === props.card.board_id);
          const cardIndex = tempBoards[boardIndex].cards.findIndex(card => card.cardId === props.card.cardId);
          const tasks = [...values.tasks];
          
          const tempTasks = tasks.filter((item) => item.subtaskId !== id);
          console.log(tempTasks);
          setValues({
            ...values,
            tasks: tempTasks,
          });
          tempBoards[boardIndex].cards[cardIndex].tasks = tempTasks;
          localStorage.setItem("prac-kanban", JSON.stringify(tempBoards));
          setBoards(tempBoards);
          alert("subtask deleted");
        }
        else{
          console.log(json.message);
        }
    } catch (error) {
      console.log(error); 
    }
  };


  const updateTask = async (id, value) => {
    try {
      const tasks = [...values.tasks];
      const index = tasks.findIndex((item) => item.subtaskId === id);
      if (index < 0) return;
      const response = await fetch("http://localhost:5000/api/markSubtask",{
        method: "POST", 
        headers: {
          "Content-Type":"application/json"
        }, 
        body: JSON.stringify({
          subtaskId: id,
          value: value
        })
      })

      const json = await response.json();

      if(json.success)
        {
          tasks[index].isCompleted = value;
          const boardId = boards[props.boardIndex].boardId;
          const cardId = boards[props.boardIndex].cards[props.cardIndex].cardId;
          const newCard = boards[props.boardIndex].cards[props.cardIndex];
          newCard.tasks[index].isCompleted = value;
          props.updateCard(boardId, cardId, newCard);
          console.log("getting checked" , newCard.tasks[index])

          setValues({
            ...values,
            tasks,
          });
          const subtaskAlert = "Subtask " + " '" + newCard.tasks[index].subtask_title+ "'" + " marked " + value
          // alert("Subtask '", newCard.tasks[index].subtask_title, " ' marked ", value);
          alert(subtaskAlert)
        }
        else
        {
          console.log(json.message);
        }

    } catch (error) {
      console.log(error)  
    }
  };

  //===========================================YAHA TAK ==================================

  const calculatePercent = () => {
    if (!values.tasks?.length) return 0;
    const completed = values.tasks?.filter((item) => item.isCompleted)?.length;
    return (completed / values.tasks?.length) * 100;
  };

  const updateDate = (date) => {
    if (!date) return;

    setValues({
      ...values,
      date,
    });
  };

  useEffect(() => {
    if (props.updateCard) props.updateCard(props.boardId, values.cardId, values);
    // calculatePercent();
  }, [values]);

  //----------------------------------------------------------------------------
  const [message, setMessage] = useState("");
  const socket = io("http://localhost:5000"); // Connect to your Socket.IO server

  useEffect(() => {
    // Listen for messages from the server
    socket.on("message", (data) => {
      console.log(data); // Process the message data
    });

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  //-----------------------------------------------------------
  
  // const sendMessage = () => {
  //       socket.emit('send', message);
  //       setMessage('');
  // };




  const addCollaborator = async(value) => {

    try {

      const boardId = boards[props.boardIndex].boardId;
      const cardId = boards[props.boardIndex].cards[props.cardIndex].cardId;
      
      const response = await fetch("http://localhost:5000/api/addCollaborator", {
        method: 'POST', 
        headers:{
          "Content-type":"application/json",
        }, 
        body:JSON.stringify({
          boardId: boardId,
          cardId: cardId,
          collaborator_email:value,
        })
      })

      const json = await response.json();
      if(json.success)
      {
        alert("collaborator added");
      }


    } catch (error) {
      console.log(error);
    }

  }







   const handleSubmitMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 0) {
      // Assuming you have a socket instance available
      socket.emit('send', trimmedMessage);
      setMessage(''); // Clear the input after sending the message
    }
  };
  
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = () => {
    setIsClicked(!isClicked);
  }
  return (
    <Modal onClose={props.onClose}>
      <div className="cardinfo">
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Users/>
            <p>Collaboration</p>
          </div>
          <Editable
            text = "Collab With"
            placeholder = "Collaborator's Email"
            onSubmit= {(value)=>{addCollaborator(value)}}
          />
          <div className="cardinfo_box_title">
            <Type />
            <p>Title</p>
          </div>
          <Editable
            defaultValue={values.title}
            text={values.title}
            placeholder="Enter Title"s
            onSubmit={updateTitle}
          />


          <button onClick={() => {setIsChatModalOpen(true); 
                    }} className="chat-button">chat</button>
          <Chatmodal email = {userEmail} name = {userName} values = {values}
          socket={socket} room={room} isOpen={isChatModalOpen} onClose={toggleOverlay}>
                     <div className="chat-box">
                      <input
                        ref={messageInputRef}
                        id="messageInp"
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        />
                      <button onClick={handleSubmitMessage}>Send</button>
                    </div>
          </Chatmodal>
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <List />
            <p>Description</p>
          </div>
          <Editable
            defaultValue={values.desc}
            text={values.desc || "Add a Description"}
            placeholder="Enter description"
            onSubmit={updateDesc}
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Calendar />
            <p>Date</p>
          </div>
          <input
            type="date"
            defaultValue={values.date}
            min={new Date().toISOString().substr(0, 10)}
            onChange={(event) => updateDate(event.target.value)}
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Tag />
            <p>Labels</p>
          </div>
          <div className="cardinfo_box_labels">
            {values.labels?.map((item, index) => (
              <label
                key={index}
                style={{ backgroundColor: item.color, color: "#fff" }}
                >
                {item.text}
                <X onClick={() => removeLabel(item)} />
              </label>
            ))}
          </div>
          <ul>
            {colors.map((item, index) => (
              <li
                key={index + item}
                style={{ backgroundColor: item }}
                className={selectedColor === item ? "li_active" : ""}
                onClick={() => setSelectedColor(item)}
              />
            ))}
          </ul>
          <Editable
            text="Add Label"
            placeholder="Enter label text"
            onSubmit={(value) =>
              addLabel({ color: selectedColor, text: value })
            }
          />
        </div>

        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <CheckSquare />
            <p>Tasks</p>
          </div>
          <div className="cardinfo_box_progress-bar">
            <div
              className="cardinfo_box_progress"
              style={{
                width: `${calculatePercent()}%`,
                backgroundColor: calculatePercent() === 100 ? "limegreen" : "",
              }}
            />
          </div>
          <div className="cardinfo_box_task_list">
            {!(typeof (boards)=== "undefined") ? boards[props.boardIndex].cards[props.cardIndex].tasks.map((item) => (
              <div key={item.subtaskId} className="cardinfo_box_task_checkbox">
                <input
                  type="checkbox"
                  defaultChecked={item.isCompleted}
                  onChange={(event) =>
                    {updateTask(item.subtaskId, event.target.checked)
                      console.log(event.target.checked);
                    }
                  }
                />
                <p className={item.isCompleted ? "completed" : ""}>{item.subtask_title}</p>

                <div className="subtask-actions">
                  
                  {/* <button className={`raise-query ${isClicked ? 'clicked' : ''}`}
                    onClick={handleClick}>Raise-query</button> */}
                  <button className={`raise-query ${isClicked ? 'clicked' : ''}`}
                    onClick={handleClick}> Raise-query
                    <svg>
                      <defs>
                        <filter id="glow">
                          <fegaussianblur result="coloredBlur" stddeviation="5"></fegaussianblur>
                          <femerge>
                            <femergenode in="coloredBlur"></femergenode>
                            <femergenode in="coloredBlur"></femergenode>
                            <femergenode in="coloredBlur"></femergenode>
                            <femergenode in="SourceGraphic"></femergenode>
                          </femerge>
                        </filter>
                      </defs>
                      <rect />
                    </svg>
                  </button>
                </div>
                <Trash onClick={() => removeTask(item.subtaskId)} />
                
              </div>
            )):""}
          </div>
          <Editable
            text={"Add a SubTask"}
            placeholder="Enter Subtask"
            onSubmit={(value) =>{addsubtaskhandler(value)}}
          />
        </div>
      </div>
    </Modal>
  );
}

export default CardInfo;
