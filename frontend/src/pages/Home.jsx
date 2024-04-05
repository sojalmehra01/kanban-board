import Editable from "../Components/Editabled/Editable";
import Board from "../Components/Board/Board";
import React, { useEffect, useState, } from "react";
import { supabase } from "../Supabaseclient";
import { useNavigate } from "react-router-dom";

const Home = () => {

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
    console.log(user);
    console.log(user.user_metadata.full_name);
    userDetails = user;
    user_name = user.user_metadata.full_name;
    console.log(userDetails)
    retrieveBoards();
  }
  
  const retrieveBoards = async () => {
    try {
      console.log(user_name);
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
      console.log(json);
      if (json.success) {
        alert("welcome");
        console.log(json.boards);
      } else {
        console.log(json.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  

  const [boards, setBoards] = useState(
    JSON.parse(localStorage.getItem("prac-kanban")) || []
      );
    
    const [targetCard, setTargetCard] = useState({
      bid: "",
      cid: "",
    });
    
      const addboardHandler = async (name) => {
        try{

        const { data: { user } } = await supabase.auth.getUser()
        console.log(user);
        console.log(user.user_metadata.full_name);
        userDetails = user;
        user_name = user.user_metadata.full_name;
        console.log(userDetails)


        const tempBoards = [...boards];
        console.log(Date.now())
        let boardId = Date.now() + Math.random() * 2;
        boardId = boardId.toFixed(1);
        boardId = boardId*10;
        console.log(boardId);

        const newBoard = {
          id: boardId,
          title: name, 
          cards: [],
        }
        tempBoards.push(newBoard);
        setBoards(tempBoards);

        const response = await fetch("http://localhost:5000/api/createBoard", 
        {
          method: "POST", 
          headers: {
            "Content-Type":"application/json"
          }, 
          body: JSON.stringify({
            title: newBoard.title, 
            board_id: newBoard.id,
            board_user: user_name,
          })
        })
        console.log(userDetails.email)
        const json = await response.json();
        if(json.success)
        {
          alert('board created')
        }
        
        else{
          console.log(json);
      // Assuming the server sends a specific error message for duplicate titles
          if (json.error === 'Duplicate title') {
            alert('A board with this name already exists. Please choose a different name.');
          }
        }
      }
        catch (error) {
          console.error('Error creating board:', error);
          // Handle the error appropriately, e.g., show an alert to the user
          alert('An error occurred while creating the board. Please try again.');
       }
      };
    
      const removeBoard = async(id) => {
        const index = boards.findIndex((item) => item.id === id);

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
      const addCardHandler = (id, title) => {
        const index = boards.findIndex((item) => item.id === id);
        if (index < 0) return;
    
        const tempBoards = [...boards];
        tempBoards[index].cards.push({
          id: Date.now() + Math.random() * 2,
          title,
          labels: [],
          date: "",
          tasks: [],
        });
        setBoards(tempBoards);
      };
    
      const removeCard = (bid, cid) => {
        const index = boards.findIndex((item) => item.id === bid);
        if (index < 0) return;
    
        const tempBoards = [...boards];
        const cards = tempBoards[index].cards;
    
        const cardIndex = cards.findIndex((item) => item.id === cid);
        if (cardIndex < 0) return;
    
        cards.splice(cardIndex, 1);
        setBoards(tempBoards);
      };
    
      const dragEnded = (bid, cid) => {
        let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
        s_boardIndex = boards.findIndex((item) => item.id === bid);
        if (s_boardIndex < 0) return;
    
        s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
          (item) => item.id === cid
        );
        if (s_cardIndex < 0) return;
    
        t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
        if (t_boardIndex < 0) return;
    
        t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
          (item) => item.id === targetCard.cid
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
        const index = boards.findIndex((item) => item.id === bid);
        if (index < 0) return;
    
        const tempBoards = [...boards];
        const cards = tempBoards[index].cards;
    
        const cardIndex = cards.findIndex((item) => item.id === cid);
        if (cardIndex < 0) return;
    
        tempBoards[index].cards[cardIndex] = card;
    
        setBoards(tempBoards);
      };

    
      useEffect(() => {
        localStorage.setItem("prac-kanban", JSON.stringify(boards));
      }, [boards]);



  return (
    <div className='home'>
      <div className="container">
        <div className="app_boards_container">
        <div className="app_boards">
          {boards.map((item) => (
            <Board
              key={item.id}
              board={item}
              addCard={addCardHandler}
              removeBoard={() => removeBoard(item.id)}
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
