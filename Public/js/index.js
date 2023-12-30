const container = document.getElementById("container");
const phone = document.getElementById("phone");
const overlayCon = document.getElementById("overlayCon");
const overlayBtn = document.getElementById("overlayBtn");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("Password");
const signUpButton = document.getElementById("signup");
const loginemail = document.getElementById("loginemail");
const loginpassword = document.getElementById("loginpassword");
const loginbutton = document.getElementById("login");
const message = document.getElementById("message");
const signupmessage = document.getElementById("signupmessage");
const forgotpassword = document.getElementById("forgotpassword");
overlayBtn.addEventListener("click", () => {
  container.classList.toggle("right-panel-active");
});
signUpButton.addEventListener("click", on_Signup);
async function on_Signup(e) {
  try {
    e.preventDefault();
    if (!nameInput.value || !emailInput.value || !passwordInput.value) {
      signupmessage.innerHTML = "Please fill out all required fields";
      signupmessage.style.color = "red";
      setTimeout(() => signupmessage.remove(), 5000);
      return;
    }

    const data = {
      name: nameInput.value,
      email: emailInput.value,
      phonenumber: phone.value,
      password: passwordInput.value,
    };
    console.log(data);
    const signupdata = await axios.post("user/signup", data);
    if (signupdata.status == 201) {
      nameInput.value = "";
      emailInput.value = "";
      phone.value = "";
      passwordInput.value = "";
      alert("account created Sucessfully");
    }
  } catch (error) {
    alert("Account Already Exists");
    console.error("An error occurred:", error);
  }
}

loginbutton.addEventListener("click", onSignin);
async function onSignin(e) {
  try {
    e.preventDefault();
    if (!loginemail.value || !loginpassword.value) {
      message.innerHTML = "Please fill out all required fields";
      message.style.color = "red";
      setTimeout(() => message.remove(), 5000);
      return;
    }
    const data = {
      email: loginemail.value,
      password: loginpassword.value,
    };
    const signinResponse = await axios.post("user/signin", data);
    if (signinResponse.status == 201) {
      loginemail.value = "";
      loginpassword.value = "";
      window.location.href = "/user";
    }
  } catch (error) {
    console.log(error);
  }
}
