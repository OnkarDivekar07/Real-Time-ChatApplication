const socket = io(window.location.origin);
socket.on("common-message", () => {
  if (formElements.message_btn.id == 0) {
    ShowCommonChats();
  }
});

const formElements = {
  messageInput: message_form.querySelector('input[name="Message"]'),
  message_btn: message_form.querySelector('input[type="submit"]'),
  flexSwitch: message_form.querySelector("#flexSwitch"),
  flexLabel: message_form.querySelector("label"),
  flexInput: message_form.querySelector("#flexInput"),
};

const group_editbtn = group_headContainer.querySelector('input[type="submit"]');

formElements.flexSwitch.addEventListener("change", () => {
  if (formElements.flexLabel.innerText === "text") {
    formElements.flexLabel.innerText = "image";
    formElements.flexInput.setAttribute("accept", "image/*");
    formElements.flexInput.type = "file";
  } else {
    formElements.flexLabel.innerText = "text";
    formElements.flexInput.removeAttribute("accept");
    formElements.flexInput.type = "text";
  }
});

formElements.message_btn.addEventListener("click", on_SendMessage);

function showChatOnScreen(chatHistory, userId) {
  chat_body.innerHTNL = "";
  let messageText = "";
  chatHistory.forEach((ele) => {
    const date = new Date(ele.date_time);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = date.toLocaleString("en-US", options);
    // const isImage = /\.(jpg|jpeg|png|gif)$/i.test(ele.message);
    if (ele.userId == userId) {
      if (ele.isImage) {
        messageText += `      
            <div class="col-12 mb-2 pe-0">
                <div class="card p-2 float-end rounded-4 self-chat-class">
                    <p class="text-primary my-0"><small>${ele.name}</small></p>
                    <a href="${ele.message}" target="_blank">
                      <img src="${ele.message}" class="chat-image">
                    </a>
                    <small class="text-muted text-end">${formattedDate}</small>
                </div>
            </div>
                `;
      } else {
        messageText += `                            
                <div class="col-12 mb-2 pe-0">
                    <div class="card p-2 float-end rounded-4 self-chat-class">
                        <p class="text-primary my-0"><small>${ele.name}</small></p>
                        <p class="my-0">${ele.message}</p>
                        <small class="text-muted text-end">${formattedDate}</small>
                    </div>
                </div>`;
      }
    } else {
      if (ele.isImage) {
        messageText += `                            
                <div class="col-12 mb-2 pe-0">
                    <div class="card p-2 float-start rounded-4 chat-class">
                        <p class="text-danger my-0"><small>${ele.name}</small></p>
                        <a href="${ele.message}" target="_blank">
                        <img src="${ele.message}" class="chat-image">
                      </a>
                        <small class="text-muted">${formattedDate}</small>
                    </div>
                </div>`;
      } else {
        messageText += `                            
                <div class="col-12 mb-2 pe-0">
                    <div class="card p-2 float-start rounded-4 chat-class">
                        <p class="text-danger my-0"><small>${ele.name}</small></p>
                        <p class="my-0">${ele.message}</p>
                        <small class="text-muted">${formattedDate}</small>
                    </div>
                </div>`;
      }
    }
  });
  chat_body.innerHTML = messageText;
  chat_container.scrollTop = chat_container.scrollHeight;
}

async function on_SendMessage(e) {
  try {
    if (e.target && message_form.checkValidity()) {
      e.preventDefault();
      const groupId = e.target.id;
      if (formElements.flexLabel.innerText === "text") {
        const data = {
          message: formElements.messageInput.value,
          GroupId: groupId,
        };
        await axios.post("chat/post-message", data);
      } else {
        const file = formElements.messageInput.files[0];
        if (file && file.type.startsWith("image/")) {
          const formData = new FormData();
          formData.append("image", file);
          formData.append("GroupId", groupId);
          const imageResponse = await axios.post("chat/post-image", formData);
        } else {
          alert("Please select a valid image file.");
        }
      }
      message_form.reset();
      if (groupId == 0) {
        socket.emit("new-common-message");
        ShowCommonChats();
      } else {
        socket.emit("new-group-message", groupId);
        showGroupChats(groupId);
      }
    }
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

async function ShowCommonChats() {
  try {
    let savingChats;
    const chats = localStorage.getItem("chatHistory");
    if (chats && chats.length != 2) {
      const parsedChatHistory = JSON.parse(chats);
      const lastMessageId =
        parsedChatHistory[parsedChatHistory.length - 1].messageId;
      const APIresponse = await axios(
        `chat/get-messages?lastMessageId=${lastMessageId}`
      );
      const apiChats = APIresponse.data.chats;
      const mergedChats = [...parsedChatHistory, ...apiChats];
      savingChats = mergedChats.slice(-1000);
    } else {
      const APIresponse = await axios(`chat/get-messages?lastMessageId=0`);
      const apiChats = APIresponse.data.chats;
      savingChats = apiChats.slice(-1000);
    }
    const getUserResponse = await axios.get("/chat/get-user");
    const userId = getUserResponse.data.userId;
    localStorage.setItem("chatHistory", JSON.stringify(savingChats));
    showChatOnScreen(savingChats, userId);
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
    window.location = "/";
  }
}

ShowCommonChats();
