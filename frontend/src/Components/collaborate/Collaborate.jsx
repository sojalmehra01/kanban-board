import React, { useState } from 'react'

const Collaborate = () => {

    const [isCollaborate, setIsCollaborate] = useState(false);


  return (
    <div>
      {isCollaborate? (
        <form className='collaborate-input'>
            <input placeholder="Enter Collaborator's Email"/>
        </form>
      ):(
        <button onClick={setIsCollaborate(true)}>Collaborate</button>
      )}
    </div>
  )
}

export default Collaborate
