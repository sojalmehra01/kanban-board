import io from 'socket.io-client';

const socket = io('http://localhost:5000')

const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")


const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

const sendButton = document.querySelector('.send'); // Assuming your send button has a class 'send'
sendButton.addEventListener('click', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

document.addEventListener('DOMContentLoaded', () => {
    const name = prompt("Enter your name to join chat");
    socket.emit('new-user-joined', name);
});

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left')
})

socket.on('receive', data => {
    append(`${data.user} : ${data.message}` , 'left')
})