import Editable from "../Components/Editabled/Editable";
import Board from "../Components/Board/Board";
import React, { useEffect, useState, } from "react";
import { supabase } from "../Supabaseclient";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const [sharedBoards, setSharedBoards] = useState({
          _id : "",
          boardId: 1,
          title: "Shared", 
          cards: [],
  });

  const getCollabSubtasks = async(cardId)=> {
    try {
      const response = await fetch ("http://localhost:5000/api/getCollabSubtasks", {
        method: "POST", 
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({
          cardId: cardId,
        })
      })

      const json = await response.json();

      if(json.success)
        {
          console.log("subtasks retrieved", json.subtasks);
          return json.subtasks;
        }

      else{
        console.log(json.message);
      }
    } catch (error) {
      console.log(error);
    }
  }


  const getCollabCards = async() => {
    try {
      // console.log(userDetails.user_metadata.email);
      const userEmail = userDetails.user_metadata.email;
      const response  = await fetch("http://localhost:5000/api/getCollaborationCards", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: userEmail
        })
      }
    )

    const json = await response.json();
    
    if(json.success)
      {
        const temp = sharedBoards;
        temp.cards = json.cards;
        // retrieving subtasks and adding to them to their respective collab cards
        const updatedCards = await Promise.all(temp.cards.map(async (item, index)=>{
          const subtasks = await getCollabSubtasks(item.cardId);
          // item.tasks = subtasks;
          console.log("i am card from temp at index" , index, item);
          return { ...item, tasks: subtasks };
        }));
        temp.cards = updatedCards;
        setSharedBoards(temp);
        const br = { ...boards[0], cards: sharedBoards.cards }; 
        const newBoards = [...boards];
        newBoards[0] = br;
        console.log(" i am new Board" , newBoards[0]);
        setBoards(newBoards);
        localStorage.setItem("prac-kanban", JSON.stringify(newBoards));
      }
      else
      {
        console.log(json.message);
      }
    }
    catch(error)
    {
      console.error(error);
    }
  }

 
  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem("prac-kanban")) || []
      );

  const navigate = useNavigate();
  
  
  const token = localStorage.getItem('sb-tkxtjervogiccudypfwz-auth-token');
  let userDetails = {};
  let user_name = '';
  
 useEffect(()=>{
  if(!userDetails || !token)
  {
    navigate('/login'); 
   }
   retrieveUser();
   
 },[])

 const retrieveUser = async() =>{
  const { data: { user } } = await supabase.auth.getUser()
    userDetails = user;
    user_name = user.user_metadata.full_name;
    retrieveBoards();
    getCollabCards();
    if(boards[0].title!== "Shared")
      {
        ShiftIndex();
      }

  }
  
  const ShiftIndex = () => {
    let tempBoards = [...boards]
    console.log("yahi boards hai pehle ",boards);
    if (tempBoards[0].board_title !== "Shared") {
      tempBoards.unshift(sharedBoards);
      setBoards(tempBoards)
      console.log("ye h baad m ",boards);
    }
  }
  const retrieveBoards = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/getBoards",
       {
         method: "POST", 
          headers: {
            "Content-Type":"application/json"
          }, 
          body: JSON.stringify({
            user_name: user_name,
          })
        } 
        )
      const json = await response.json();
      // console.log(json);
      if (json.success) {
        // console.log(json.boards);
        // for (let i = 0; i < json.boards.length; i++){
        //   boards[i]._id = json.boards[i]._id ; 
        // }
        //setBoards(json.boards);
      } else {
        console.log(json.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  

    
    
    const [targetCard, setTargetCard] = useState({
      bid: "",
      cid: "",
    });
    
      const addboardHandler = async (name) => {
        try{

        const { data: { user } } = await supabase.auth.getUser()
        // console.log(user);
        // console.log(user.user_metadata.full_name);
        userDetails = user;
        user_name = user.user_metadata.full_name;                            
        // console.log(userDetails)


        const tempBoards = [...boards];
        console.log(Date.now())
        let boardId = Date.now() + Math.random() * 2;
        boardId = boardId.toFixed(1);
        boardId = boardId*10;
        console.log(boardId);

        let newBoard = {
          _id : "",
          boardId: boardId,
          title: name, 
          cards: [],
        }
        

        const response = await fetch("http://localhost:5000/api/createBoard", 
        {
          method: "POST", 
          headers: {
            "Content-Type":"application/json"
          }, 
          body: JSON.stringify({
            title: newBoard.title, 
            board_id: newBoard.boardId,
            board_user: user_name,
          })
        })
        // console.log(userDetails.email)
        const json = await response.json();
        if(json.success)
        {
          console.log(json.message);
          tempBoards.push(newBoard);
          setBoards(tempBoards);
          alert('board created')
          retrieveUser();
        }
        else{
          console.log(json);
          // Assuming the server sends a specific error message for duplicate titles . 
          if (json.error === 'duplicate title') {
            alert('A board with this name already exists. Please choose a different name.');
          }else {
                // Handle other errors
                alert('An error occurred while creating the board. Please try again.');
            }
        }
      }
        catch (error) {
          // console.error('Error creating board:', error);
          alert(error);
          // Handle the error appropriately, e.g., show an alert to the user
       }
      };
    
      const removeBoard = async(id) => {
        // retrieveUser();
        console.log("deleting this board " + id);
        const index = boards.findIndex((item) => item.boardId === id);

        try {
          const response = await fetch('http://localhost:5000/api/deleteBoard',
            {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
              },
              body:JSON.stringify({
                boardId: id,
              })
            }
          )

          const json = await response.json();
          if(json.success)
          {
            console.log('board deleted successfully');
            if (index < 0) return;
            const tempBoards = [...boards];
            tempBoards.splice(index, 1);
            setBoards(tempBoards);
            retrieveUser();
          }
          else{
            alert("cannot delete please try again later");
            console.log(json);
          }

        } catch (error) {
          console.error(error);
        }
      };
    
      //add task 
      const addCardHandler = async(id, title) => {
      try {
        console.log(id);
        console.log(title)
        const index = boards.findIndex((item) => item.boardId === id);
        console.log(index);
        if (index < 0) return;
        console.log(index);
    
        const tempBoards = [...boards];
        // tempBoards[index].cards.push({
        //   carddId: Date.now() + Math.random() * 2,
        //   title,
        //   labels: [],
        //   date: "",
        //   tasks: [],
        // });

        
        const { data: { user } } = await supabase.auth.getUser()
        console.log(user);
        console.log(user.user_metadata.full_name);
        userDetails = user;
        user_name = user.user_metadata.full_name;
        console.log(userDetails)

        let cardId = Date.now() + Math.random() * 2;
        cardId = cardId.toFixed(1);
        cardId = cardId*10;
        console.log(cardId);

        let newCard = {
          board_id: tempBoards[index].boardId,
          cardId: cardId,
          title: title,
          board_title: tempBoards[index].title,
          card_user: user_name,
          tasks: [],
          card_sharedWith:[]
        }

        console.log(newCard);

        const response = await fetch('http://localhost:5000/api/addCard',
        {
          method: 'POST',
          headers: {
          "Content-Type" : "application/json"              
          },
          body: JSON.stringify({
            boardId: tempBoards[index]._id,
            cardId: cardId,
            card_title: newCard.title,
            card_user:user_name,
            card_sharedWith: [],
          })
        }
      )
      const json = await response.json();
      if (json.success) {
        tempBoards[index].cards.push(newCard);
        setBoards(tempBoards);
        alert('card added');
        }
          else {
            console.log(json.error);
          }
      }
        catch(error) {
        console.log(error);
        }
      };
    
      const removeCard = (bid, cid) => {
        const index = boards.findIndex((item) => item.boardId === bid);
        if (index < 0) {
          console.log('index is zero');
          return;
        };
    
        const tempBoards = [...boards];
        const cards = tempBoards[index].cards;
    
        const cardIndex = cards.findIndex((item) => item.cardId === cid);
        if (cardIndex < 0) return;
    
        cards.splice(cardIndex, 1);
        setBoards(tempBoards);
      };
    
      const dragEnded = (bid, cid) => {
        let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
        s_boardIndex = boards.findIndex((item) => item.boardId === bid);
        if (s_boardIndex < 0) return;
    
        s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
          (item) => item.cardId === cid
        );
        if (s_cardIndex < 0) return;
    
        t_boardIndex = boards.findIndex((item) => item.boardId === targetCard.bid);
        if (t_boardIndex < 0) return;
    
        t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
          (item) => item.cardId === targetCard.cid
        );
        if (t_cardIndex < 0) return;
    
        const tempBoards = [...boards];
        const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
        tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
        tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
        setBoards(tempBoards);
    
        setTargetCard({
          bid: "",
          cid: "",
        });
      };
    
      const dragEntered = (bid, cid) => {
        if (targetCard.cid === cid) return;
        setTargetCard({
          bid,
          cid,
        });
      };
    
      const updateCard = (bid, cid, card) => {
        const index = boards.findIndex((item) => item.boardId === bid);
        const tempBoards = [...boards];
        const cards = tempBoards[index].cards;
        const cardIndex = cards.findIndex((item) => item.cardId === cid);
        tempBoards[index].cards[cardIndex] = card;
        if (index < 0 || cardIndex < 0) return;
        
    
        setBoards(tempBoards);
      };   

      useEffect(() => {
        localStorage.setItem("prac-kanban", JSON.stringify(boards));
      }, [boards]);

  // const ShiftIndex =  {
  //   console.log(tempBoards[0].board_title);
  // }
      
  return (
    <div className='home'>
      <div className="container">
        <div className="app_boards_container">
        <div className="app_boards">
          {boards.map((item, index) => (
            <Board
              index = {index}
              key={item.boardId}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.boardId)}
              removeCard={removeCard}
              dragEnded={dragEnded}
              dragEntered={dragEntered}
              updateCard={updateCard}
            />
          ))}
          <div className="app_boards_last">
            <Editable
              displayClass="app_boards_add-board"
              editClass="app_boards_add-board_edit"
              placeholder="Enter Board Name"
              text="Add Board"
              buttonText="Add Board"
              onSubmit={addboardHandler}
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Home
