import React, { useRef, useEffect, useState } from "react";
import { supabase } from "../Supabaseclient";
// import ScrollToBottom from "react-scroll-to-bottom";
import "./chat-modal.css"

const Chatmodal = ({ values, isOpen, socket, username, room }) => {

  const message_ref = useRef(null);

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const cardDetails = values;
  const cardId = values.cardId;
  console.log("i'm card id ", cardId)

  let userDetails = {};
  let user_email = '';

  const retrieveUser = async() =>{
    const { data: { user } } = await supabase.auth.getUser()
      userDetails = user;
      user_email = user.user_metadata.email;
      retrieveChats();
    }

    const retrieveChats = async()=>{
      try{
        const response = await fetch("http://localhost:5000/api/getMessages", 
          {
            method: "POST", 
            headers:{
              "Content-Type":"application/json"
            }, 
            body: JSON.stringify({
              room: cardId, 
              author: user_email,
            })
          }
        )

        const json = await response.json();
        if(json.success)
          {
            console.log(json.messages);
            setMessageList(json.messages);
          }
      }
      catch(error)
      {
        console.log(error);
        alert("error retrieving chats")
      }
    }

    useEffect(()=>{
      retrieveUser();
    },[])

  const sendMessage = async () => {

    try{
      if(!user_email)
        {
          await retrieveUser();
          if (currentMessage !== "") {
            const messageData = {
              room: cardId,
              author: user_email,
              message: currentMessage,
              time: 
                new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
            };
            console.log(typeof(messageData.author))
            console.log(messageData)
            const response = await fetch("http://localhost:5000/api/createMessage", {
              method: "POST", 
              headers:{
                "Content-Type":"application/json"
              }, 
              body: JSON.stringify({
                room: messageData.room, 
                author: messageData.author, 
                message: messageData.message,
                time: messageData.time
              })
            })
    
            const json = await response.json();
            if(json.success){
              console.log("reposnse form retrieving chats" ,json.message)
              setMessageList((list) => [...list, messageData]);
              await socket.emit("send_message", messageData);
              setCurrentMessage("");
            }
            else
            {
              alert("Message not sent! Please try again!");
        }

        }
      }
    }
    catch(error){
      alert(error);
    }



  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(()=>{
    message_ref.current?.scrollIntoView();
  },[messageList])

  return (
    <>
      {isOpen && (
         <div className="chat-window">
         <div className="chat-header">
           <p>Live Chat</p>
         </div>
         <div className="chat-body">
           {/* <ScrollToBottom className="message-container"> */}
             {messageList.map((messageContent) => {
               return (
                 <div
                 className="message"
                 id={username === messageContent.author ? "you" : "other"}
                 >
                   <div>
                     <div className="message-content">
                       <p>{messageContent.message}</p>
                     </div>
                     <div className="message-meta">
                       <p id="time">{messageContent.time}</p>
                       <p id="author">{messageContent.author}</p>
                     </div>
                   </div>
                 </div>
               );
             })}
           {/* </ScrollToBottom> */}
                 <div ref={message_ref}/>
         </div>
         <div className="chat-footer">
           <input
             type="text"
             value={currentMessage}
             placeholder="Hey..."
             onChange={(event) => {
               setCurrentMessage(event.target.value);
             }}
             onKeyPress={(event) => {
               event.key === "Enter" && sendMessage();
             }}
           />
           <button onClick={sendMessage}>&#9658;</button>
         </div>
       </div>
      )}
    </>
  )
}

export default Chatmodal
