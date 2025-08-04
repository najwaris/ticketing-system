// Sample ticket data
const sampleTickets = [
  {
    id: "scfjj38ry47ldsfj9",
    category: "Internal Connectivity",
    title: "Slow Internet Connection @ KBH",
    description:
      "Users in the KBH building are experiencing significantly slower than usual internet speeds, affecting productivity. The issue appears to be intermittent, with speeds dropping particularly during peak hours (10AM-2PM). Initial diagnostics show packet loss when pinging the main gateway. This issue affects both wired and wireless connections across all floors. IT team has been notified and is currently investigating possible bandwidth throttling or hardware malfunctions.",
    status: "In Progress",
    statusClass: "in-progress",
  },
  {
    id: "xcfkq92ry47ldsfj3",
    category: "Hardware Issue",
    title: "Printer Not Working - 3rd Floor",
    description:
      "The color printer in the 3rd floor common area (Model: HP Color LaserJet Pro MFP M479fdw) is displaying a 'Paper Jam' error message, but no paper is visibly jammed in the machine. Multiple users have reported this issue. Power cycling the printer temporarily resolves the issue but it reoccurs after 10-15 prints.",
    status: "Open",
    statusClass: "open",
  },
  {
    id: "plmkn21ry47ldsfj5",
    category: "Software Support",
    title: "Adobe Creative Cloud Installation",
    description:
      "Need assistance with installing Adobe Creative Cloud suite on a new MacBook Pro (M1 Chip, macOS Monterey). Installation fails with error code 501. User has valid license through enterprise account but can't proceed past authentication screen. Issue may be related to new device provisioning in our MDM system.",
    status: "Completed",
    statusClass: "completed",
  },
];

function searchTicket() {
  const searchTerm = document
    .getElementById("ticketSearch")
    .value.trim()
    .toLowerCase();

  if (!searchTerm) {
    displayTickets(sampleTickets);
    return;
  }

  const filteredTickets = sampleTickets.filter(
    (ticket) =>
      ticket.id.toLowerCase().includes(searchTerm) ||
      ticket.title.toLowerCase().includes(searchTerm) ||
      ticket.category.toLowerCase().includes(searchTerm) ||
      ticket.description.toLowerCase().includes(searchTerm)
  );

  if (filteredTickets.length === 0) {
    alert("No tickets found matching your search.");
    document.getElementById("ticketList").innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">
              <p style="font-size: 18px; margin-bottom: 15px;">No tickets found for "${searchTerm}"</p>
              <p>Try searching with different keywords or check the ticket ID.</p>
            </div>
          `;
    return;
  }

  displayTickets(filteredTickets);
}

function displayTickets(tickets) {
  const ticketList = document.getElementById("ticketList");
  ticketList.innerHTML = "";

  if (tickets.length === 0) {
    ticketList.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-light);">
              <p style="font-size: 18px;">No tickets to display</p>
            </div>
          `;
    return;
  }

  tickets.forEach((ticket) => {
    const ticketItem = document.createElement("div");
    ticketItem.className = "ticket-item";
    ticketItem.innerHTML = `
            <div class="ticket-id">Ticket ID: ${ticket.id}</div>
            <div class="ticket-title">${ticket.title}</div>
            <div class="ticket-status ${ticket.statusClass}">${ticket.status}</div>
          `;
    ticketItem.addEventListener("click", () => showTicketModal(ticket));
    ticketList.appendChild(ticketItem);
  });
}

function showTicketModal(ticket) {
  document.getElementById(
    "modalTicketId"
  ).textContent = `Ticket ID: ${ticket.id}`;
  document.getElementById("modalTicketCategory").textContent = ticket.category;
  document.getElementById("modalTicketTitle").textContent = ticket.title;
  document.getElementById("modalTicketDescription").textContent =
    ticket.description;
  document.getElementById("modalTicketStatus").textContent = ticket.status;

  // Update status class
  const statusElement = document.getElementById("modalTicketStatus");
  statusElement.className = "modal-ticket-status " + ticket.statusClass;

  document.getElementById("ticketModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("ticketModal").style.display = "none";
}

// Event listeners
window.addEventListener("click", function (event) {
  if (event.target === document.getElementById("ticketModal")) {
    closeModal();
  }
});

document
  .getElementById("ticketSearch")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchTicket();
    }
  });

window.addEventListener("load", function () {
  document.getElementById("ticketSearch").focus();
  displayTickets(sampleTickets);
});
