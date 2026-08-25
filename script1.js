// Prevent access to index.html without login
if (location.pathname.includes("index.html") && localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "login.html";
}

function selectRestaurant(name) {
  document.getElementById("restaurant").value = name;
}

document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const restaurant = document.getElementById("restaurant").value;
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const guests = document.getElementById("guests").value;

  const table = document.getElementById("bookingTable");
  const row = table.insertRow();
  row.innerHTML = `
    <td>${restaurant}</td>
    <td>${name}</td>
    <td>${date}</td>
    <td>${time}</td>
    <td>${guests} Guests</td>
  `;

  const confirmation = document.getElementById("confirmation");
  confirmation.textContent = `✅ Booking confirmed for ${name} at ${restaurant} on ${date} at ${time} for ${guests} guests.`;
  confirmation.classList.remove("hidden");

  document.getElementById("bookingForm").reset();
});
