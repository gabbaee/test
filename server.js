const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data.json");

function readData() {
    return JSON.parse(
fs.readFileSync(DATA_FILE, "utf8")
    );
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE,
        JSON.stringify(data, null, 2)
    );
}

app.get("/api/bookings", (req, res) => {

    const bookings = readData();

    res.json(bookings);

});

app.get("/api/bookings/:bookingNumber", (req, res) => {

    const bookings = readData();

    const booking = bookings.find(
        d => d.bookingNumber === req.params.bookingNumber
    );

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    res.json(booking);

});

app.post("/api/bookings", (req, res) => {

    const bookings = readData();

    const { bookingNumber, student, room, date, start_time, end_time } = req.body;

    if (!bookingNumber || !student || !room || !date || !start_time || !end_time ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const exists = bookings.some(
        d => d.bookingNumber === bookingNumber
    );

    if (exists) {
        return res.status(400).json({
            message: "Booking number already exists"
        });
    }

    const newBooking = {
        bookingNumber, student, room, date, start_time, end_time
    };

    bookings.push(newBooking);

    saveData(bookings);

    res.status(201).json({
        message: "Booking added successfully",
        booking: newBooking
    });

});

app.delete("/api/bookings/:bookingNumber", (req, res) => {

    const bookings = readData();

    const updated = bookings.filter(
        d => d.bookingNumber !== req.params.bookingNumber
    );

    if (updated.length === bookings.length) {
        return res.status(404).json({
            message: "Booking not found"
        });
    }

    saveData(updated);

    res.json({
        message: "Booking deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
