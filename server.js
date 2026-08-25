const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ======================================================
// FRONTEND
// ======================================================

const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));


// ======================================================
// HOME PAGE
// ======================================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(publicPath, "index.html")
    );

});


// ======================================================
// TEMPORARY BOOKING STORAGE
// ======================================================
//
// This storage is temporary.
// It is suitable for testing the frontend/backend
// connection.
//
// Vercel serverless functions do NOT provide permanent
// database storage.
//
// ======================================================

let bookings = [];

let nextBookingId = 1;


// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/health", (req, res) => {

    res.status(200).json({

        status: "OK",

        message: "Restaurant backend is running successfully"

    });

});


// ======================================================
// CREATE BOOKING
// ======================================================

app.post("/book", (req, res) => {

    try {

        const {
            name,
            phone,
            date,
            time,
            people
        } = req.body;


        // ----------------------------------------------
        // Validate fields
        // ----------------------------------------------

        if (
            !name ||
            !phone ||
            !date ||
            !time ||
            !people
        ) {

            return res.status(400).json({

                success: false,

                error: "All booking fields are required"

            });

        }


        // ----------------------------------------------
        // Validate number of people
        // ----------------------------------------------

        const numberOfPeople = Number(people);


        if (
            !Number.isInteger(numberOfPeople) ||
            numberOfPeople < 1 ||
            numberOfPeople > 20
        ) {

            return res.status(400).json({

                success: false,

                error: "Number of guests must be between 1 and 20"

            });

        }


        // ----------------------------------------------
        // Create booking
        // ----------------------------------------------

        const booking = {

            id: nextBookingId++,

            restaurant: "Foodies",

            name: String(name).trim(),

            phone: String(phone).trim(),

            date: String(date),

            time: String(time),

            people: numberOfPeople

        };


        // ----------------------------------------------
        // Store booking
        // ----------------------------------------------

        bookings.push(booking);


        console.log(
            "New booking:",
            booking
        );


        // ----------------------------------------------
        // Send response
        // ----------------------------------------------

        return res.status(201).json({

            success: true,

            message: "Booking created successfully",

            bookingId: booking.id,

            booking: booking

        });

    }

    catch (error) {

        console.error(
            "Booking creation error:",
            error
        );


        return res.status(500).json({

            success: false,

            error: "Failed to create booking"

        });

    }

});


// ======================================================
// GET ALL BOOKINGS
// ======================================================

app.get("/bookings", (req, res) => {

    try {

        const sortedBookings = [...bookings].sort(
            (a, b) => {

                const dateA =
                    `${a.date} ${a.time}`;

                const dateB =
                    `${b.date} ${b.time}`;

                return dateA.localeCompare(dateB);

            }
        );


        return res.status(200).json(
            sortedBookings
        );

    }

    catch (error) {

        console.error(
            "Fetch bookings error:",
            error
        );


        return res.status(500).json({

            success: false,

            error: "Failed to fetch bookings"

        });

    }

});


// ======================================================
// GET SINGLE BOOKING
// ======================================================

app.get("/bookings/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);


        const booking =
            bookings.find(
                booking => booking.id === id
            );


        if (!booking) {

            return res.status(404).json({

                success: false,

                message: "Booking not found"

            });

        }


        return res.status(200).json(
            booking
        );

    }

    catch (error) {

        console.error(
            "Get booking error:",
            error
        );


        return res.status(500).json({

            success: false,

            error: "Failed to get booking"

        });

    }

});


// ======================================================
// CANCEL BOOKING
// ======================================================

app.delete("/cancel/:id", (req, res) => {

    try {

        const id =
            Number(req.params.id);


        const bookingIndex =
            bookings.findIndex(
                booking => booking.id === id
            );


        if (bookingIndex === -1) {

            return res.status(404).json({

                success: false,

                message: "Booking not found"

            });

        }


        const deletedBooking =
            bookings[bookingIndex];


        bookings.splice(
            bookingIndex,
            1
        );


        console.log(
            "Booking cancelled:",
            deletedBooking
        );


        return res.status(200).json({

            success: true,

            message: "Booking cancelled successfully",

            id: id

        });

    }

    catch (error) {

        console.error(
            "Cancel booking error:",
            error
        );


        return res.status(500).json({

            success: false,

            error: "Failed to cancel booking"

        });

    }

});


// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        error: "Route not found",

        path: req.originalUrl

    });

});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {

    console.error(
        "Server error:",
        err
    );


    res.status(500).json({

        success: false,

        error: "Internal server error"

    });

});


// ======================================================
// LOCAL SERVER
// ======================================================

if (require.main === module) {

    app.listen(
        PORT,
        () => {

            console.log(
                `Server is running on http://localhost:${PORT}`
            );

        }
    );

}


// ======================================================
// EXPORT APP FOR VERCEL
// ======================================================

module.exports = app;