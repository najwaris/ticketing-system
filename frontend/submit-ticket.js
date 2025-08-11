// Form submission
document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Get form values
  const email = document.getElementById("email").value;
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  if (!email || !title || !category || !description) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    const response = await fetch(
      "https://capstone-func-app.azurewebsites.net/api/submitTicket?code=SixosvvN9b04e8L8w_pLZZ4lr_z5udiNFP3Ov13luUNaAzFuzQtwcQ==",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          title: title,
          category: category,
          description: description,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    const data = await response.json();
    document.getElementById("ticketMessage").textContent = data.message;
    document.getElementById("ticketID").textContent = data.ticket_id;
  } catch (error) {
    document.getElementById("ticketMessage").textContent =
      error.message || String(error);
  }
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
