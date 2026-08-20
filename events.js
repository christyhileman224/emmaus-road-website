// ==========================================================
// EMMAUS ROAD - UPCOMING EVENTS
// Reads events from events.json and displays upcoming events
// ==========================================================

async function loadEvents() {

    const eventContainer = document.getElementById("events-list");

    if (!eventContainer) {
        return;
    }

    try {

        // Load events.json
        const response = await fetch("events.json");

        if (!response.ok) {
            throw new Error("Unable to load events.");
        }

        const events = await response.json();


        // --------------------------------------------------
        // TODAY
        //
        // Setting the time to midnight prevents an event
        // from disappearing partway through its event date.
        // --------------------------------------------------

        const today = new Date();

        today.setHours(0, 0, 0, 0);


        // --------------------------------------------------
        // FILTER + SORT
        //
        // Past events disappear automatically.
        // Upcoming events are sorted chronologically.
        // --------------------------------------------------

        const upcomingEvents = events
            .filter(event => {

                const eventDate =
                    new Date(event.date + "T00:00:00");

                return eventDate >= today;

            })
            .sort((a, b) => {

                const dateA =
                    new Date(a.date + "T00:00:00");

                const dateB =
                    new Date(b.date + "T00:00:00");

                return dateA - dateB;

            });


        // --------------------------------------------------
        // NOTHING UPCOMING
        // --------------------------------------------------

        if (upcomingEvents.length === 0) {

            eventContainer.innerHTML = `
                <div class="no-events">
                    <p>
                        Check back soon for upcoming events
                        at Emmaus Road.
                    </p>
                </div>
            `;

            return;
        }


        // --------------------------------------------------
        // DISPLAY EVENTS
        //
        // Homepage shows the next 4 events.
        // --------------------------------------------------

        const eventsToDisplay =
            upcomingEvents.slice(0, 4);


        eventContainer.innerHTML =
            eventsToDisplay
                .map(createEventCard)
                .join("");


    } catch (error) {

        console.error(
            "Emmaus Road events error:",
            error
        );

        eventContainer.innerHTML = `
            <div class="no-events">
                <p>
                    Upcoming events are temporarily unavailable.
                </p>
            </div>
        `;

    }

}



// ==========================================================
// CREATE ONE EVENT CARD
// ==========================================================

function createEventCard(event) {

    const date =
        new Date(event.date + "T00:00:00");


    const month =
        date.toLocaleDateString(
            "en-US",
            { month: "short" }
        );


    const day =
        date.toLocaleDateString(
            "en-US",
            { day: "numeric" }
        );


    const weekday =
        date.toLocaleDateString(
            "en-US",
            { weekday: "short" }
        );


    // Only show time/details when supplied.

    const timeHTML =
        event.time
            ? `<div class="event-time">${event.time}</div>`
            : "";


    const detailsHTML =
        event.details
            ? `<div class="event-details">${event.details}</div>`
            : "";


    return `

        <article class="event-card">

            <div class="event-date">

                <span class="event-month">
                    ${month}
                </span>

                <strong class="event-day">
                    ${day}
                </strong>

                <span class="event-weekday">
                    ${weekday}
                </span>

            </div>


            <div class="event-info">

                <h3>
                    ${event.title}
                </h3>

                ${timeHTML}

                ${detailsHTML}

            </div>

        </article>

    `;

}



// ==========================================================
// START
// ==========================================================

loadEvents();
