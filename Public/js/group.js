const socket = io(window.location.origin);
socket.on("group-message", (groupId) => {
  showGroupChats(groupId);
});
const formElements = {
  messageInput: message_form.querySelector('input[name="Message"]'),
  message_btn: message_form.querySelector('input[type="submit"]'),
  flexSwitch: message_form.querySelector("#flexSwitch"),
  flexLabel: message_form.querySelector("label"),
  flexInput: message_form.querySelector("#flexInput"),
};
const modelElements = {
  groupName: group_model.querySelector('input[name="group_name"]'),
  searchBar: group_model.querySelector('input[name="search_bar"]'),
  groupDesription: group_model.querySelector(
    'textarea[name="group_description"]'
  ),
  editStatus: group_model.querySelector('input[name="edit_status"]'),
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
create_groupBtn.addEventListener("click", showingAllUser);
group_editbtn.addEventListener("click", showingGroupDetails);
modelElements.searchBar.addEventListener("keyup", searchUser);
model_submibtn.addEventListener("click", createGroup);
group_body.addEventListener("click", showGroupChat);

//it controls all the activity related to showcasing chats on the screen color font attributtues etc
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

//it shows user when user type or do something in search
function searchUser(e) {
  const text = e.target.value.toLowerCase();
  const items = user_list.querySelectorAll("li");
  const usersArr = Array.from(items);
  usersArr.forEach(blockdisplay);
  function blockdisplay(value) {
    const userName = value.querySelector("h6").textContent;
    if (userName.toLowerCase().indexOf(text) != -1) {
      value.classList.add("d-flex");
      value.style.display = "block";
    } else {
      value.classList.remove("d-flex");
      value.style.display = "none";
    }
  }
}

async function showGroupChats(groupId) {
  try {
    const config = {
      params: {
        groupId: groupId,
      },
    };
    const APIresponse = await axios.get("group/get-group-messages", config);
    const apiChats = APIresponse?.data?.chats;
    const getUserResponse = await axios.get("/chat/get-user");
    const userId = getUserResponse?.data?.userId;
    showChatOnScreen(apiChats, userId);
  } catch (error) {
    logger.error(error);
  }
}
async function ShowGroup() {
  try {
    const groupsResponse = await axios(`group/get-mygroups`);
    const { groups } = groupsResponse.data;
    group_body.innerHTML = `
        `;
    let html = "";
    groups.forEach((ele) => {
      const date = new Date(ele.date);
      const options = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = date.toLocaleString("en-US", options);
      html += `               
         <button class="list-group-item list-group-item-action py-2" 
            data-bs-toggle="list">
            <div class="d-flex w-100 align-items-center justify-content-between" id="${ele.id}">
                <strong class="mb-1">${ele.name}</strong>
                <small>${ele.membersNo} Members</small>
            </div>
        </button>`;
    });
    group_body.innerHTML += html;
  } catch (error) {
    console.log(error);
  }
}

//send post message or post image according to toogle condition
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
      if (groupId) {
        socket.emit("new-group-message", groupId);
        showGroupChats(groupId);
      }
    }
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

//it shows all the users for group creation
async function showingAllUser() {
  try {
    user_list.parentElement.classList.remove("d-none");
    const usersResponse = await axios.get("group/get-users");
    user_list.innerHTML = "";
    let text = "";
    const { users } = usersResponse.data;
    users.forEach((user) => {
      text += `                                    
        <li class="list-group-item  d-flex  justify-content-between">
            <div class="d-flex  align-items-center justify-content-between">
                <h6><strong class="mb-1">${user.name}</strong></h6>
            </div>
            <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
        </li>`;
    });
    user_list.innerHTML = text;
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

//it show group related information when user clicks on edit or create button
async function showingGroupDetails(e) {
  try {
    const groupId = e.target.id;
    user_list.parentElement.classList.remove("d-none");
    const usersResponse = await axios.get("group/get-users");
    const memberApi = await axios(`group/get-group-members?groupId=${groupId}`);
    const groupMebers = memberApi.data.users;
    const idSet = new Set(groupMebers.map((item) => item.id));
    user_list.innerHTML = "";
    let text = "";
    const { users } = usersResponse.data;
    users.forEach((user) => {
      if (idSet.has(user.id)) {
        text += `                                    
                <li class="list-group-item  d-flex  justify-content-between">
                    <div class="d-flex  align-items-center justify-content-between">
                        <h6><strong class="mb-1">${user.name}</strong></h6>
                    </div>
                    <input type="checkbox" class="form-check-inline" name="users" value="${user.id}" checked>
                </li>`;
      } else {
        text += `                                    
                <li class="list-group-item  d-flex  justify-content-between">
                    <div class="d-flex  align-items-center justify-content-between">
                        <h6><strong class="mb-1">${user.name}</strong></h6>
                    </div>
                    <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
                </li>`;
      }
    });
    user_list.innerHTML = text;
    const GroupApiresponse = await axios(`group/get-group?groupId=${groupId}`);
    const { group } = GroupApiresponse.data;
    modelElements.groupName.value = group.name;
    model_submibtn.innerHTML = "Update Details";
    model_heading.innerHTML = `Update ${group.name} Details`;
    modelElements.editStatus.value = groupId;
    modal_closeBtn.classList.add("d-none");
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}
//it invoke group creation model and handles group creation activity
async function createGroup(e) {
  try {
    if (create_group_form.checkValidity()) {
      e.preventDefault();
      const groupName = create_group_form.querySelector("#group_name").value;
      const selectedUsers = Array.from(
        user_list.querySelectorAll('input[name="users"]:checked')
      ).map((checkbox) => checkbox.value);
      const data = {
        name: groupName,
        membersNo: selectedUsers.length + 1,
        membersIds: selectedUsers,
      };
      if (modelElements.editStatus.value == "false") {
        await axios.post("group/create-group", data);
        alert("Group successfully created");
      } else {
        const groupId = modelElements.editStatus.value;
        await axios.post(`group/update-group?groupId=${groupId}`, data);

        model_submibtn.innerHTML = "Create Group";
        model_heading.innerHTML = `Create new group`;
        modelElements.editStatus.value = "false";
        modal_closeBtn.classList.remove("d-none");
        alert("Group successfully updated");
      }
      create_group_form.reset();
      $("#group_model").modal("hide");
      ShowGroup();
    } else {
      alert("fill all details ");
    }
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

//this function help us navigating between groups
async function showGroupChat(e) {
  try {
    const groupId = e.target.id;
    const getUserResponse = await axios.get("/chat/get-user");
    const userId = getUserResponse.data.userId;
    if (groupId && groupId != "group_body") {
      setupGroup(groupId, userId);
      if (groupId == 0) {
        ShowCommonChats();
      } else {
        const APIresponse = await axios(
          `group/get-group-messages?groupId=${groupId}`
        );
        const apiChats = APIresponse.data.chats;
        showChatOnScreen(apiChats, userId);
      }
    } else {
      console.log("no group id");
    }
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
    // window.location = '/';
  }
}
//it show group when user clicks on to it
async function setupGroup(groupId, userId) {
  try {
    const APIresponse = await axios(`group/get-group?groupId=${groupId}`);
    const { group } = APIresponse.data;
    group_heading.innerHTML = `${group.name}`;
    group_members.innerHTML = ` ${group.membersNo} Members`;
    const memberApi = await axios(`group/get-group-members?groupId=${groupId}`);
    const { users } = memberApi.data;
    const usersString = users.map((item) => item.name.trim()).join(",");
    group_members.setAttribute("data-bs-original-title", `${usersString}`);
    formElements.message_btn.id = groupId;
    if (group.AdminId == userId) {
      group_editbtn.id = groupId;
      group_editbtn.classList.remove("d-none");
    } else {
      group_editbtn.classList.add("d-none");
    }
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
  }
}

ShowGroup();

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});
