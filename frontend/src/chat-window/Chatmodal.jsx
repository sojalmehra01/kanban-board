import React, { useRef, useEffect, useState } from "react";
import { supabase } from "../Supabaseclient";
// import ScrollToBottom from "react-scroll-to-bottom";
import "./chat-modal.css"

const Chatmodal = ({ values, isOpen, socket}) => {
  // console.log(email, name);

  const message_ref = useRef(null);

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const cardId = values.cardId;

  // const [userDetails, setUserDetails] = useState({});
  
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

    

  const retrieveUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserName(user.user_metadata.full_name);
    setUserEmail(user.user_metadata.email);
    retrieveChats();
  };
  
  
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
              author: userEmail,
            })
          }
        )

        const json = await response.json();
        if(json.success)
          {
            // console.log(json.messages);
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
      if(userEmail)
        {
          if (currentMessage !== "") {
            const messageData = {
              room: cardId,
              author: userEmail,
              author_name: userName,
              message: currentMessage,
              time: 
                new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
            };
            console.log(messageData)
            const response = await fetch("http://localhost:5000/api/createMessage", {
              method: "POST", 
              headers:{
                "Content-Type":"application/json"
              }, 
              // body: JSON.stringify({
              //   room: messageData.room, 
              //   author: messageData.author, 
              //   author_name: messageData.author_name,
              //   message: messageData.message,
              //   time: messageData.time
              // })
              body: JSON.stringify(messageData)
            })
    
            const json = await response.json();
            if(json.success){
              console.log("reposnse form creating chats" ,json.message)
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
             {messageList.map((messageContent) => {
               return (
                 <div
                 className="message"
                 id={userEmail === messageContent.author ? "you" : "other"}
                 >
                   <div>
                     <div className="message-content">
                       <p>{messageContent.message}</p>
                     </div>
                     <div className="message-meta">
                       <p id="time">{messageContent.time}</p>
                       <p id="author">{messageContent.author_name}</p>
                     </div>
                   </div>
                 </div>
               );
             })}
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
