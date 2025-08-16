document.getElementById("viewTicketForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("emailInput").value;
  const resultsDiv = document.getElementById("ticketResults");
  resultsDiv.innerHTML = "Searching...";

  try {
    const response = await fetch(
      `https://capstone-func-app.azurewebsites.net/api/getTicket?email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      throw new Error("Error fetching ticket(s).");
    }

    const data = await response.json();

    if (data.length === 0) {
      resultsDiv.innerHTML = `<p>No tickets found for ${email}</p>`;
      return;
    }

    // Show tickets with click handlers
    resultsDiv.innerHTML = data.map(ticket => `
      <div class="ticket-card" data-ticket='${JSON.stringify(ticket)}'>
        <div class="ticket-header">
          <span class="ticket-id">Ticket ID: #${ticket.id.substring(0, 8).toUpperCase()}</span>
          <div class="ticket-category">${ticket.category || "General"}</div>
        </div>
        
        <div class="ticket-content">
          <h2 class="ticket-subject">${ticket.subject || "No Subject"}</h2>
          <div class="ticket-description">
            <p>${ticket.description || "No description provided"}</p>
          </div>
        </div>
        
        <div class="ticket-footer">
          <span class="ticket-status ${(ticket.status || "").toLowerCase().replace(" ", "-")}">
            ${ticket.status || "Status unknown"}
          </span>
        </div>
      </div>
    `).join("");

    // Add click handlers to each ticket card
    document.querySelectorAll('.ticket-card').forEach(card => {
      card.addEventListener('click', function() {
        const ticket = JSON.parse(this.getAttribute('data-ticket'));
        showTicketModal(ticket);
      });
    });

  } catch (err) {
    resultsDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
});

// Insert hidden modal HTML (only runs once when page loads)
document.body.insertAdjacentHTML('beforeend', `
  <div class="ticket-modal" id="ticketModal">
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div id="modalTicketContent"></div>
    </div>
  </div>
`);

function showTicketModal(ticket) {
  const modal = document.getElementById('ticketModal');
  const content = document.getElementById('modalTicketContent');
  
  content.innerHTML = `
    <div class="modal-ticket">
      <h2 class="modal-title">Ticket Details</h2>
      
      <div class="ticket-id-badge">
        <span class="id-label">Ticket ID:</span>
        <span class="id-value">#${ticket.id.substring(0, 8).toUpperCase()}</span>
      </div>
      
      <div class="ticket-info-grid">
        <div class="info-item">
          <span class="info-label">Category:</span>
          <span class="info-value category-badge">${ticket.category || "General"}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Status:</span>
          <span class="info-value status-badge ${(ticket.status || "").toLowerCase()}">
            ${ticket.status || "Unknown"}
          </span>
        </div>
      </div>
      
      <div class="ticket-content">
        <h3 class="ticket-subject">${ticket.subject || "No Subject"}</h3>
        <div class="ticket-description">
          <p>${ticket.description || "No description provided"}</p>
        </div>
      </div>
      
      <div class="ticket-meta">
        <div class="meta-item">
          <i class="fas fa-envelope"></i>
          <span>${ticket.email || "No email provided"}</span>
        </div>
        <div class="meta-item">
          <i class="fas fa-calendar-alt"></i>
          <span>${ticket._ts ? new Date(ticket._ts * 1000).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : "Date unknown"}</span>
        </div>
      </div>
    </div>
  `;
  
  modal.style.display = "flex";
}



// Close modal when clicking X
document.querySelector('.close-modal').addEventListener('click', function() {
  document.getElementById('ticketModal').style.display = "none";
});


// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('ticketModal');
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

