import consumer from "channels/consumer"

document.addEventListener('DOMContentLoaded', function() {
    if (window.currentRoom) {
        const roomChannel = consumer.subscriptions.create(
            { channel: "RoomChannel", room: `room_${window.currentRoom}` },
            {
                received(data) {
                    console.log("Received message:", data);
                    const messagesDiv = document.getElementById('messages');
                    if (messagesDiv) {
                        const messageBox = document.createElement('div');
                        messageBox.style.cssText = 'margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; background-color: #e9ecef; border-radius: 5px;';
                        messageBox.textContent = data.message;
                        messagesDiv.appendChild(messageBox);
                    }
                },
                connected() {
                    console.log("Connected to RoomChannel with ID: " + `room_${window.currentRoom}`);
                },
                disconnected() {
                    console.log("Disconnected from RoomChannel with ID: " + `room_${window.currentRoom}`);
                }
            }
        );
    }
});
