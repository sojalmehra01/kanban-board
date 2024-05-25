import React from 'react'
import "./chat-modal.css"

const Chatmodal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="overlay">
          <div className="overlay__background" onClick={onClose} />
          <div className="overlay__container">
            {/* //is div mai likhna hai code aappko sojal bhaiya (frontend ka) */}
            <div className="overlay__controls">
              <button
                className="overlay__close"
                type="button"
                onClick={onClose}
              />

            </div>
            {children}
          </div>
        </div>
      )}
    </>
  )
}

export default Chatmodal
