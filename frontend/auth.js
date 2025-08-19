const msalConfig = {
  auth: {
    // clientId: "506c4789-8d9b-402d-9507-37561ea5c9d7", //najwa's tenant
    clientId: "450ba4f8-551c-47cd-b01e-720e5dfdb776", //taufik's tenant
    authority: "https://login.microsoftonline.com/common",
    redirectUri: "https://kind-desert-01941d300.2.azurestaticapps.net/",
  },
};

const loginRequest = {
  scopes: ["User.Read"],
};

const msalInstance = new msal.PublicClientApplication(msalConfig);
msalInstance.handleRedirectPromise().then((response) => {
  if (response) {
    msalInstance.setActiveAccount(response.account);
    localStorage.setItem("isAuthenticated", "true");
    window.location.href = "home.html"; // send user to homepage after login
  } else {
    // If we're already in home.html but not logged in, force back to index
    if (
      window.location.pathname.endsWith("home.html") &&
      !localStorage.getItem("isAuthenticated")
    ) {
      window.location.href = window.location.origin + "/index.html";
    }
  }
});
const handleLogin = document.getElementById("loginBtn");
if (handleLogin) {
  handleLogin.onclick = async () => {
    msalInstance.loginRedirect({
      ...loginRequest,
      prompt: "select_account",
    });
  };
}

const handleLogout = document.getElementById("logoutBtn");
if (handleLogout) {
  handleLogout.onclick = async () => {
    localStorage.removeItem("isAuthenticated");
    await msalInstance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin + "/index.html",
      account: msalInstance.getActiveAccount(),
    });
  };
}
