document
  .getElementById("viewTicketForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("idInput").value;
    const resultsDiv = document.getElementById("ticketResults");
    resultsDiv.innerHTML = "Searching...";

    try {
      const response = await fetch(
        `https://capstone-func-app.azurewebsites.net/api/getTicket?id=${id}`
      );

      if (!response.ok) {
        throw new Error("Error fetching ticket(s).");
      }

      const ticket = await response.json();

      // if (data.length === 0) {
      //   resultsDiv.innerHTML = `<p>No tickets found for ${id}</p>`;
      //   return;
      // }

      if (!ticket || !ticket.id) {
        resultsDiv.innerHTML = `<p>No ticket found for ${id}</p>`;
        return;
      }

      //  Show tickets with click handlers
      // resultsDiv.innerHTML = data
      //   .map(
      //     (ticket) => `
      //    <div class="ticket-card" data-ticket='${JSON.stringify(ticket)}'>
      //      <div class="ticket-header">
      //        <span class="ticket-id">Ticket ID: #${ticket.id
      //          .substring(0, 8)
      //          .toUpperCase()}</span>
      //        <div class="ticket-category">${ticket.category || "General"}</div>
      //      </div>

      //      <div class="ticket-content">
      //        <h2 class="ticket-subject">${ticket.subject || "No Subject"}</h2>
      //        <div class="ticket-description">
      //          <p>${ticket.description || "No description provided"}</p>
      //        </div>
      //      </div>

      //      <div class="ticket-footer">
      //        <span class="ticket-status ${(ticket.status || "")
      //          .toLowerCase()
      //          .replace(" ", "-")}">
      //          ${ticket.status || "Status unknown"}
      //        </span>
      //        <div class="ticket-category">${ticket.category || "General"}</div>
      //      </div>
      //    </div>
      //  `
      //   )
      //   .join("");

      resultsDiv.innerHTML = `
        <div class="ticket-card" data-ticket="${JSON.stringify(ticket)}">
          <div class="ticket-header">
            <span class="ticket-id">
              Ticket ID: #${ticket.id.substring(0, 36).toUpperCase()}
            </span>
            <div class="ticket-category">${ticket.category || "General"}</div>
          </div>

          <div class="ticket-content">
            <h2 class="ticket-subject">${ticket.subject || "No Subject"}</h2>
            <div class="ticket-description">
              <p>${ticket.description || "No description provided"}</p>
            </div>
          </div>

          <div class="ticket-footer">
            <span
              class="ticket-status ${(ticket.status || "")
                .toLowerCase()
                .replace(" ", "-")}"
            >
              ${ticket.status || "Status unknown"}
            </span>
          </div>
        </div>
      `;

      // Add click handlers to each ticket card
      // document.querySelectorAll(".ticket-card").forEach((card) => {
      //   card.addEventListener("click", function () {
      //     const ticket = JSON.parse(this.getAttribute("data-ticket"));
      //     showTicketModal(ticket);
      //   });
      // });
      document
        .querySelector(".ticket-card")
        .addEventListener("click", function () {
          showTicketModal(ticket);
        });
    } catch (err) {
      resultsDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
  });

// Insert hidden modal HTML (only runs once when page loads)
document.body.insertAdjacentHTML(
  "beforeend",
  `
  <div class="ticket-modal" id="ticketModal">
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <div id="modalTicketContent"></div>
    </div>
  </div>
`
);

function showTicketModal(ticket) {
  const modal = document.getElementById("ticketModal");
  const content = document.getElementById("modalTicketContent");

  content.innerHTML = `
    <div class="modal-ticket">
      <h2 class="modal-title">Ticket Details</h2>
      
      <div class="ticket-id-badge">
        <span class="id-label">Ticket ID:</span>
        <span class="id-value">#${ticket.id
          .substring(0, 36)
          .toUpperCase()}</span>
      </div>
      
      <div class="ticket-info-grid">
        <div class="info-item">
          <span class="info-label">Category:</span>
          <span class="info-value category-badge">${
            ticket.category || "General"
          }</span>
        </div>
        <div class="info-item">
          <span class="info-label">Status:</span>
          <span class="info-value status-badge ${(
            ticket.status || ""
          ).toLowerCase()}">
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
          <span>${
            ticket._ts
              ? new Date(ticket._ts * 1000).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Date unknown"
          }</span>
        </div>
      </div>
    </div>
    
   <div class="print-icon" onclick="printTicket()">
        <i class="fas fa-print"></i>
      </div>
    </div>
  `;

  modal.style.display = "flex";
}

// Close modal when clicking X
document.querySelector(".close-modal").addEventListener("click", function () {
  document.getElementById("ticketModal").style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  const modal = document.getElementById("ticketModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

function printTicket() {
  const modalContent = document.querySelector(".modal-content").cloneNode(true);
  modalContent.querySelector(".print-icon")?.remove();

  const printWindow = window.open("", "", "width=800,height=600");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ticket Details</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #4a2c5a;
          --secondary: #6c757d;
          --success: #28a745;
          --warning: #ffc107;
          --danger: #dc3545;
          --light: #f8f9fa;
          --dark: #343a40;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
        }
        
        .ticket-print {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 2.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .ticket-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid var(--primary);
        }
        
        .ticket-title {
          color: var(--primary);
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }
        
        .ticket-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .meta-group {
          display: flex;
          flex-direction: column;
        }
        
        .meta-label {
          font-size: 0.875rem;
          color: var(--secondary);
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        
        .meta-value {
          font-size: 1rem;
          font-weight: 400;
        }
        
        .ticket-id {
          font-family: 'Roboto Mono', monospace;
          font-weight: 600;
          color: var(--primary);
        }
        
        .status-badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-open {
          background-color: rgba(220, 53, 69, 0.1);
          color: var(--danger);
        }
        
        .status-in-progress {
          background-color: rgba(255, 193, 7, 0.1);
          color: #b58a00;
        }
        
        .status-resolved {
          background-color: rgba(40, 167, 69, 0.1);
          color: var(--success);
        }
        
        .ticket-content {
          margin: 2rem 0;
        }
        
        .ticket-subject {
          font-size: 1.5rem;
          color: var(--dark);
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
        }
        
        /* Target the container holding the title and description */
        #ticket-container {
          margin: 0;
          padding: 0;
        }

        /* Remove spacing after the title */
        #ticket-container h1 {
          margin-bottom: 0; /* Removes space below the title */
        }

        /* Tighten the description text */
        .ticket-description {
          margin-top: 0;  /* No gap after the title */
          padding-top: 0; /* No extra padding */
          text-align: left;
          line-height: 1.4; /* Tighter line spacing */
        }

        /* Remove paragraph margins if used */
        .ticket-description p {
          margin: 0;
          padding: 0;
        }
        
        .ticket-footer {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #eee;
          font-size: 0.875rem;
        }
        
        .footer-item {
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .footer-icon {
          color: var(--primary);
          width: 1rem;
          text-align: center;
        }
        
        
        @media print {
          body {
            padding: 0;
          }
          @page {
            size: A4;
            margin: 1.5cm;
          }
          .ticket-print {
            border: none;
            box-shadow: none;
            padding: 0;
          }
          .watermark {
            opacity: 0.05;
          }
        }
      </style>
    </head>
    <body>
      <div class="ticket-print">
        <div class="ticket-header">
          <h1 class="ticket-title">Ticket Details</h1>
        </div>
        
        <div class="ticket-meta">
          <div class="meta-group">
            <span class="meta-label">Ticket ID</span>
            <span class="meta-value ticket-id">${
              modalContent.querySelector(".id-value")?.textContent || "N/A"
            }</span>
          </div>
          <div class="meta-group">
            <span class="meta-label">Category</span>
            <span class="meta-value">${
              modalContent.querySelector(".category-badge")?.textContent ||
              "General"
            }</span>
          </div>
          <div class="meta-group">
            <span class="meta-label">Status</span>
            <span class="meta-value status-badge status-${
              modalContent.querySelector(".status-badge")?.classList[1] ||
              "unknown"
            }">
              ${
                modalContent.querySelector(".status-badge")?.textContent ||
                "Unknown"
              }
            </span>
          </div>
        </div>
        
        <div class="ticket-content">
          <h2 class="ticket-subject">${
            modalContent.querySelector(".ticket-subject")?.textContent ||
            "No Subject"
          }</h2>
          <div class="ticket-description">
            ${
              modalContent.querySelector(".ticket-description")?.innerHTML ||
              "No description provided"
            }
          </div>
        </div>
        
        <div class="ticket-footer">
          <div class="footer-item">
            <span class="footer-icon">✉️</span>
            <span>${
              modalContent.querySelector(".ticket-meta")?.children[0]
                ?.textContent || "No email provided"
            }</span>
          </div>
          <div class="footer-item">
            <span class="footer-icon">📅</span>
            <span>${
              modalContent.querySelector(".ticket-meta")?.children[1]
                ?.textContent || "Date unknown"
            }</span>
          </div>
        </div>
        
        
      </div>
    </body>
    </html>
  `);

  printWindow.document.close();

  // Ensure fonts are loaded before printing
  printWindow.onload = function () {
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };
}
