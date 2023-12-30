const formElements = {
  messageInput: message_form.querySelector('input[name="Message"]'),
  message_btn: message_form.querySelector('input[type="submit"]'),
  flexSwitch: message_form.querySelector("#flexSwitch"),
  flexLabel: message_form.querySelector("label"),
  flexInput: message_form.querySelector("#flexInput"),
};

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

// function showChatOnScreen(chatHistory, userId) {
//   chat_body.innerHTNL = "";
//   let messageText = "";
//   chatHistory.forEach((ele) => {
//     const date = new Date(ele.date_time);
//     const options = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     const formattedDate = date.toLocaleString("en-US", options);

//     if (ele.userId == userId) {
//       if (ele.isImage) {
//         messageText += `
//             <div class="col-12 mb-2 pe-0">
//                 <div class="card p-2 float-end rounded-4 self-chat-class">
//                     <p class="text-primary my-0"><small>${ele.name}</small></p>
//                     <a href="${ele.message}" target="_blank">
//                       <img src="${ele.message}" class="chat-image">
//                     </a>
//                     <small class="text-muted text-end">${formattedDate}</small>
//                 </div>
//             </div>
//                 `;
//       } else {
//         messageText += `
//                 <div class="col-12 mb-2 pe-0">
//                     <div class="card p-2 float-end rounded-4 self-chat-class">
//                         <p class="text-primary my-0"><small>${ele.name}</small></p>
//                         <p class="my-0">${ele.message}</p>
//                         <small class="text-muted text-end">${formattedDate}</small>
//                     </div>
//                 </div>`;
//       }
//     } else {
//       if (ele.isImage) {
//         messageText += `
//                 <div class="col-12 mb-2 pe-0">
//                     <div class="card p-2 float-start rounded-4 chat-class">
//                         <p class="text-danger my-0"><small>${ele.name}</small></p>
//                         <a href="${ele.message}" target="_blank">
//                         <img src="${ele.message}" class="chat-image">
//                       </a>
//                         <small class="text-muted">${formattedDate}</small>
//                     </div>
//                 </div>`;
//       } else {
//         messageText += `
//                 <div class="col-12 mb-2 pe-0">
//                     <div class="card p-2 float-start rounded-4 chat-class">
//                         <p class="text-danger my-0"><small>${ele.name}</small></p>
//                         <p class="my-0">${ele.message}</p>
//                         <small class="text-muted">${formattedDate}</small>
//                     </div>
//                 </div>`;
//       }
//     }
//   });
//   chat_body.innerHTML = messageText;
//   chat_container.scrollTop = chat_container.scrollHeight;
// }

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

// async function ShowCommonChats() {
//   try {
//     let savingChats;
//     const chats = localStorage.getItem("chatHistory");
//     if (chats && chats.length != 2) {
//       const parsedChatHistory = JSON.parse(chats);
//       const lastMessageId =
//         parsedChatHistory[parsedChatHistory.length - 1].messageId;
//       const APIresponse = await axios(
//         `chat/get-messages?lastMessageId=${lastMessageId}`
//       );
//       const apiChats = APIresponse.data.chats;
//       const mergedChats = [...parsedChatHistory, ...apiChats];
//       savingChats = mergedChats.slice(-1000);
//     } else {
//       const APIresponse = await axios(`chat/get-messages?lastMessageId=0`);
//       const apiChats = APIresponse.data.chats;
//       savingChats = apiChats.slice(-1000);
//     }
//     const getUserResponse = await axios.get("/user/get-user");
//     const userId = getUserResponse.data.userId;
//     localStorage.setItem("chatHistory", JSON.stringify(savingChats));
//     showChatOnScreen(savingChats, userId);
//   } catch (error) {
//     console.log(error);
//     alert(error.response.data.message);
//     window.location = "/";
//   }
// }
// async function showGroupChats(groupId) {
//   try {
//     const config = {
//       params: {
//         groupId: groupId,
//       },
//     };
//     const APIresponse = await axios.get("group/get-group-messages", config);
//     const apiChats = APIresponse?.data?.chats;
//     const getUserResponse = await axios.get("/user/get-user");
//     const userId = getUserResponse?.data?.userId;
//     showChatOnScreen(apiChats, userId);
//   } catch (error) {
//     console.log(error);
//     displayErrorMessage(error);
//   }
// }

// function displayErrorMessage(error) {
//   const errorMessage = getErrorMessage(error);
//   // Display the error message to the user using a user-friendly mechanism (e.g. toast, modal, inline message)
//   // ...
// }

// function getErrorMessage(error) {
//   // Extract the error message from the error object and return it
//   // ...
// }

// async function showGroupChats(groupId) {
//   try {
//     const config = {
//       params: {
//         groupId: groupId,
//       },
//     };
//     const APIresponse = await axios.get("group/get-group-messages", config);
//     const apiChats = APIresponse?.data?.chats;
//     const getUserResponse = await axios.get("/user/get-user");
//     const userId = getUserResponse?.data?.userId;
//     showChatOnScreen(apiChats, userId);
//   } catch (error) {
//     logger.error(error);
//     displayErrorMessage(error);
//   }
// }
// async function showingAllUser() {
//   try {
//     user_list.parentElement.classList.remove("d-none");
//     const usersResponse = await axios.get("user/get-users");
//     user_list.innerHTML = "";
//     let text = "";
//     const { users } = usersResponse.data;
//     users.forEach((user) => {
//       text += `
//         <li class="list-group-item  d-flex  justify-content-between">
//             <div class="d-flex  align-items-center justify-content-between">
//                 <img src="https://picsum.photos/seed/${user.imageUrl}/200" alt="Profile Picture"
//                     class="rounded-circle me-3" style="width: 35px; height: 35px;">
//                 <h6><strong class="mb-1">${user.name}</strong></h6>
//             </div>
//             <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
//         </li>`;
//     });
//     user_list.innerHTML = text;
//   } catch (error) {
//     console.log(error);
//     alert(error.response.data.message);
//   }
// }

// async function showingGroupDetails(e) {
//   try {
//     const groupId = e.target.id;
//     user_list.parentElement.classList.remove("d-none");
//     const usersResponse = await axios.get("user/get-users");
//     const memberApi = await axios(`group/get-group-members?groupId=${groupId}`);
//     const groupMebers = memberApi.data.users;
//     const idSet = new Set(groupMebers.map((item) => item.id));
//     user_list.innerHTML = "";
//     let text = "";
//     const { users } = usersResponse.data;
//     users.forEach((user) => {
//       if (idSet.has(user.id)) {
//         text += `
//                 <li class="list-group-item  d-flex  justify-content-between">
//                     <div class="d-flex  align-items-center justify-content-between">
//                         <img src="https://picsum.photos/seed/${user.imageUrl}/200" alt="Profile Picture"
//                             class="rounded-circle me-3" style="width: 35px; height: 35px;">
//                         <h6><strong class="mb-1">${user.name}</strong></h6>
//                     </div>
//                     <input type="checkbox" class="form-check-inline" name="users" value="${user.id}" checked>
//                 </li>`;
//       } else {
//         text += `
//                 <li class="list-group-item  d-flex  justify-content-between">
//                     <div class="d-flex  align-items-center justify-content-between">
//                         <img src="https://picsum.photos/seed/${user.imageUrl}/200" alt="Profile Picture"
//                             class="rounded-circle me-3" style="width: 35px; height: 35px;">
//                         <h6><strong class="mb-1">${user.name}</strong></h6>
//                     </div>
//                     <input type="checkbox" class="form-check-inline" name="users" value="${user.id}">
//                 </li>`;
//       }
//     });
//     user_list.innerHTML = text;

//     const GroupApiresponse = await axios(`group/get-group?groupId=${groupId}`);
//     const { group } = GroupApiresponse.data;
//     modelElements.groupName.value = group.name;
//     model_submibtn.innerHTML = "Update Details";
//     model_heading.innerHTML = `Update ${group.name} Details`;
//     modelElements.editStatus.value = groupId;
//     modal_closeBtn.classList.add("d-none");
//   } catch (error) {
//     console.log(error);
//     alert(error.response.data.message);
//   }
// }

// async function showGroupChat(e) {
//   try {
//     const groupId = e.target.id;
//     const getUserResponse = await axios.get("/user/get-user");
//     const userId = getUserResponse.data.userId;
//     if (groupId && groupId != "group_body") {
//       setupGroup(groupId, userId);
//       if (groupId == 0) {
//         ShowCommonChats();
//       } else {
//         const APIresponse = await axios(
//           `group/get-group-messages?groupId=${groupId}`
//         );
//         const apiChats = APIresponse.data.chats;
//         showChatOnScreen(apiChats, userId);
//       }
//     } else {
//       console.log("no group id");
//     }
//   } catch (error) {
//     console.log(error);
//     alert(error.response.data.message);
//     // window.location = '/';
//   }
// }

// async function setupGroup(groupId, userId) {
//   try {
//     if (groupId == 0) {
//       group_heading.innerHTML = `Chat Room`;
//       group_members.innerHTML = ` All Members`;
//       group_members.setAttribute(
//         "data-bs-original-title",
//         `All Members can access this group !`
//       );
//       formElements.message_btn.id = groupId;
//       group_editbtn.classList.add("d-none");
//     } else {
//       const APIresponse = await axios(`group/get-group?groupId=${groupId}`);
//       const { group } = APIresponse.data;
//       group_heading.innerHTML = `${group.name}`;
//       group_members.innerHTML = ` ${group.membersNo} Members`;
//       const memberApi = await axios(
//         `group/get-group-members?groupId=${groupId}`
//       );
//       const { users } = memberApi.data;
//       const usersString = users.map((item) => item.name.trim()).join(",");
//       group_members.setAttribute("data-bs-original-title", `${usersString}`);
//       formElements.message_btn.id = groupId;
//       if (group.AdminId == userId) {
//         group_editbtn.id = groupId;
//         group_editbtn.classList.remove("d-none");
//       } else {
//         group_editbtn.classList.add("d-none");
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     alert(error.response.data.message);
//   }
// }
// async function setupProfile() {
//   try {
//     const getUserResponse = await axios.get("/user/get-user");
//     const { name, email, phonenumber, imageUrl } = getUserResponse.data.user;
//     (profileModel.name.innerText = name),
//       (profileModel.email.innerText = email),
//       (profileModel.phoneNumber.innerText = phonenumber);
//   } catch (error) {
//     console.log(error);
//     alert(error.response.data.message);
//   }
// }
// ShowGroup();
// ShowCommonChats();
// setupProfile();

// $(document).ready(function () {
//   $('[data-toggle="tooltip"]').tooltip();
// });
