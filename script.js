let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

async function addBooking(event) {

    event.preventDefault();

    const bookingNumber = document.getElementById("bookingNumber").value.trim();
    const student = document.getElementById("student").value.trim();
    const room = document.getElementById("room").value;
    const date = document.getElementById("date").value;
    const start_time = document.getElementById("start_time").value;
    const end_time = document.getElementById("end_time").value;

    const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            bookingNumber,
            student,
            room,
            date,
            start_time,
            end_time
        })
    });

    const result = await response.json();

    document.getElementById("message").textContent = result.message;

    if (response.ok) {
        document.getElementById("booking-form").reset();
        fetchAll();
    }
}

async function fetchAll() {

    const response = await fetch("/api/bookings");
    const bookings = await response.json();

    const list = document.getElementById("booking-list");

    list.innerHTML = "";

    bookings.forEach(booking => {

        const row = document.createElement("tr");

        const bookingCell = document.createElement("td");
        bookingCell.textContent = booking.bookingNumber;

        const studentCell = document.createElement("td");
        studentCell.textContent = booking.student;

        const roomCell = document.createElement("td");
        roomCell.textContent = booking.room;
        
        const dateCell = document.createElement("td");
        dateCell.textContent = booking.date;

        const startCell = document.createElement("td");
        startCell.textContent = booking.start_time;

        const endCell = document.createElement("td");
        endCell.textContent = booking.end_time;

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteBooking(booking.bookingNumber);
        });

        actionCell.appendChild(deleteButton);

        row.appendChild(bookingCell);
        row.appendChild(studentCell);
        row.appendChild(roomCell);
        row.appendChild(dateCell);
        row.appendChild(startCell);
        row.appendChild(endCell);
        row.appendChild(actionCell);

        list.appendChild(row);

    });
}

async function searchBookings() {

    const bookingNumber =
        document.getElementById("searchBooking").value.trim();

    const resultElement =
        document.getElementById("search-result");

    if (!bookingNumber) {
        resultElement.textContent = "Enter a booking number.";
        return;
    }

    const response = await fetch(
        `/api/bookings/${encodeURIComponent(bookingNumber)}`
    );

    if (!response.ok) {
        resultElement.textContent = "Booking not found.";
        return;
    }

    const booking = await response.json();

    resultElement.textContent =
        `Booking: ${booking.bookingNumber} | ` +
        `Student: ${booking.student} | ` +
        `Room: ${booking.room} | ` +
        `Date: ${booking.date} | ` +
        `Start Time: ${booking.start_time} | ` +
        `End Time: ${booking.end_time}`; 
}

async function deleteBooking(bookingNumber) {

    if (!confirm("Delete this booking?")) {
        return;
    }

    const response = await fetch(
        `/api/bookings/${encodeURIComponent(bookingNumber)}`,
        {
            method: "DELETE"
        }
    );

    const result = await response.json();

    alert(result.message);

    if (response.ok) {
        fetchAll();
        document.getElementById("search-result").textContent = "";
    }
}

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("booking-form")
        .addEventListener("submit", addBooking);

    fetchAll();

});

