function toggleChat() {

    const chat = document.getElementById("chatbot");

    if (chat.style.display === "block") {
        chat.style.display = "none";
    } else {
        chat.style.display = "block";
    }

}