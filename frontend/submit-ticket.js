// Generate random ticket ID
function generateTicketID() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "#";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Form submission
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const email = this.querySelector('input[type="email"]').value;
  const title = this.querySelector('input[type="text"]').value;
  const category = this.querySelector("select").value;
  const description = this.querySelector("textarea").value;

  if (!email || !title || !category || !description) {
    alert("Please fill in all required fields.");
    return;
  }

  // Show modal with ticket ID
  const ticketId = generateTicketID();
  document.getElementById("ticketId").innerText = ticketId;
  document.getElementById("successModal").style.display = "flex";
});

// Cancel button
document.querySelector(".btn-cancel").addEventListener("click", function () {
  if (
    confirm("Are you sure you want to cancel? All entered data will be lost.")
  ) {
    window.location.href = "home.html";
  }
});

// Close modal
function closeModal() {
  document.getElementById("successModal").style.display = "none";
  document.querySelector("form").reset();
  window.location.href = "home.html";
}
