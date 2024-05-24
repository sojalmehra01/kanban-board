import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
// import "./Client.js"

import { supabase } from "../../../Supabaseclient";
import {
  Calendar,
  CheckSquare,
  List,
  Tag,
  Trash,
  Type,
  X,
} from "react-feather";

import Modal from "../../Modal/Modal";
import Editable from "../../Editabled/Editable";

import "./CardInfo.css";


function CardInfo(props) {  

  


  const colors = [
    "#a8193d",
    "#4fcc25",
    "#1ebffa",
    "#8da377",
    "#9975bd",
    "#cf61a1",
    "#240959",
  ];

  const [selectedColor, setSelectedColor] = useState();
  const [values, setValues] = useState({
    ...props.card,
  });

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
        // const index = boards.findIndex((item) => item.boardId === bid);
        // if (index < 0) return;
        console.log(title);

        // const tempBoards = [...boards];
        const { data: { user } } = await supabase.auth.getUser();
        const userDetails = user;
        console.log(userDetails);

        // const cards = tempBoards[index].cards;
        console.log(values);

        let subtaskId = Date.now() + Math.random() * 2;
        subtaskId = subtaskId.toFixed(1);
        subtaskId = subtaskId * 10;
        console.log(subtaskId);

        let newSubtask = {
            // board_title: tempBoards[index].title,
            cardId: values.cardId,
            card_title: values.title, 
            subtaskId: subtaskId,
            subtask_title: title,
        };

        console.log('subtask => ', newSubtask);

        const response = await fetch('http://localhost:5000/api/createSubtask', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                // board_title: newSubtask.board_title,
                // cardId: newSubtask.cardId,
              // card_title: newSubtask.card_title,
                // board_title: tempBoards[index].title,
                cardId: newSubtask.cardId,
                card_title: newSubtask.card_title,
                subtaskId:subtaskId,
                subtask_title: newSubtask.subtask_title,
            })
        });

        const json = await response.json();
        if (json.success) {
          // setValues({
            //   ...values,
            //   tasks: [...values.tasks, newSubtask],
            // });
            addTask(newSubtask);
            console.log(values.tasks);
            alert('Subtask added');
        } else {
            console.log(json.error);
        }
    } catch (error) {
        console.log(error);
    }
};
//-----------------------------------------------------
  const addTask = (value) => {
    setValues({
      ...values,
      tasks: [...values.tasks, value],
    });
  };

  // const removeTask = (id) => {
  //   const tasks = [...values.tasks];

  //   const tempTasks = tasks.filter((item) => item.id !== id);
  //   setValues({
  //     ...values,
  //     tasks: tempTasks,
  //   });
  // };

  const removesubtask = (id) => {
    const tasks = [...values.tasks];
    const updatedTasks = tasks.map(task => {
        const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== id);
        return { ...task, subtasks: updatedSubtasks };
    });

    setValues({
        ...values,
        tasks: updatedTasks,
    });
};


  const updateTask = (id, value) => {
    const tasks = [...values.tasks];

    const index = tasks.findIndex((item) => item.id === id);
    if (index < 0) return;

    tasks[index].completed = value;

    setValues({
      ...values,
      tasks,
    });
  };

  const calculatePercent = () => {
    if (!values.tasks?.length) return 0;
    const completed = values.tasks?.filter((item) => item.completed)?.length;
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
    if (props.updateCard) props.updateCard(props.boardId, values.id, values);
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
const sendButtonHandle = (e) =>{
e.preventDefault()
  }
  
  const sendMessage = () => {
        socket.emit('send', message);
        setMessage('');
  };
  
  return (
    <Modal onClose={props.onClose}>
      <div className="cardinfo">
        <div className="cardinfo_box">
          <div className="cardinfo_box_title">
            <Type />
            <p>Title</p>
          </div>
          <Editable
            defaultValue={values.title}
            text={values.title}
            placeholder="Enter Title"
            onSubmit={updateTitle}
          />
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
            {values.tasks?.map((item) => (
              <div key={item.subtaskId} className="cardinfo_box_task_checkbox">
                <input
                  type="checkbox"
                  defaultChecked={item.completed}
                  onChange={(event) =>
                    updateTask(item.subtaskId, event.target.checked)
                  }
                />
                <p className={item.completed ? "completed" : ""}>{item.subtask_title}</p>

                <div className="subtask-actions">
                  <form action="#" id="send-container">
                  <input
                  id="messageInp"
                  className="subtask-chat"
                  name="messageInp"
                  type="text"
                  placeholder="Chat"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  />
                </form>
                  <button className="send" onClick={sendButtonHandle}>send</button>
                  <button className="raise-query">Raise a query</button>
                  <button className="atach-doc">attachment</button>
                </div>
                <Trash onClick={() => removesubtask(item.subtaskId)} />
                
              </div>
            ))}
          </div>
          <Editable
            text={"Add a Task"}
            placeholder="Enter task"
            onSubmit={(value) =>{addsubtaskhandler(value)}}
          />
        </div>
      </div>
    </Modal>
  );
}

export default CardInfo;
