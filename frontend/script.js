async function sendMessage() {
    let input = document.getElementById("user-input");
    let message = input.value;

    let chatBox = document.getElementById("chat-box");

    chatBox.innerHTML += `<p><b>You:</b> ${message}</p>`;

    input.value = "";

    let response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: message })
    });

    let data = await response.json();

chatBox.innerHTML += `<p><b>TutorAI:</b> ${data.reply || "No response"}</p>`;
}