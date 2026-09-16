// ==========================================================
// EMMAUS ROAD - NEWSLETTER DATA
// Reads newsletters.json and updates:
// 1. Newsletter archive page
// 2. Homepage "This Week" section
// ==========================================================

async function loadNewsletters() {

    try {

        const response = await fetch("newsletters.json");

        if (!response.ok) {
            throw new Error("Unable to load newsletters.");
        }

        const newsletters = await response.json();


        // Sort newest first
        newsletters.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });


        if (newsletters.length === 0) {
            return;
        }


        const latest = newsletters[0];


        // ==================================================
        // HOMEPAGE
        // ==================================================

        const homepageDate =
            document.getElementById("homepage-newsletter-date");

        const homepageLink =
            document.getElementById("homepage-newsletter-link");

        const homepageScripture =
            document.getElementById("homepage-scripture");

        const homepageTheme =
            document.getElementById("homepage-theme");


        if (homepageDate) {

            homepageDate.textContent =
                `Week of ${formatNewsletterDate(latest.date)} - Edition ${latest.edition}`;

        }


        if (homepageLink) {

            homepageLink.href = latest.file;

        }


        if (homepageScripture) {

            homepageScripture.textContent =
                latest.scripture || "Weekly Scripture";

        }


        if (homepageTheme) {

            homepageTheme.textContent =
                latest.theme || "";

        }



        // ==================================================
        // NEWSLETTER PAGE
        // ==================================================

        const latestContainer =
            document.getElementById("latest-newsletter");

        const archiveContainer =
            document.getElementById("newsletter-archive");


        if (latestContainer) {

            latestContainer.innerHTML = `
                <p class="newsletter-label">
                    Latest Edition
                </p>

                <h2>
                    Week of ${formatNewsletterDate(latest.date)}
                </h2>

                <p>
                    Edition ${latest.edition}
                </p>

                <a
                    class="button"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="${latest.file}">
                    Read This Week's Newsletter →
                </a>
            `;

        }


        if (archiveContainer) {

            const archive =
                newsletters.slice(1);


            if (archive.length === 0) {

                archiveContainer.innerHTML = `
                    <p>No previous newsletters yet.</p>
                `;

            } else {

                archiveContainer.innerHTML =
                    archive
                        .map(newsletter => {

                            return `
                                <div class="newsletter-archive-item">

                                    <div>
                                        <strong>
                                            ${formatNewsletterDate(newsletter.date)}
                                        </strong>

                                        <div>
                                            Edition ${newsletter.edition}
                                        </div>
                                    </div>

                                    <a
                                        class="text-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="${newsletter.file}">
                                        Read Newsletter →
                                    </a>

                                </div>
                            `;

                        })
                        .join("");

            }

        }


    } catch (error) {

        console.error(
            "Emmaus Road newsletter error:",
            error
        );

    }

}



// ==========================================================
// FORMAT DATE
// 2026-08-31 -> August 31, 2026
// ==========================================================

function formatNewsletterDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");


    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}



// ==========================================================
// START
// ==========================================================

loadNewsletters();
