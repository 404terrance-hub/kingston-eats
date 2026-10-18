# Kingston Eats — Signature Edition

**Student:** Terrance O’Neil Johnson  
**Student ID:** 2301011744  
**Institution:** Vocational Training Development Institute (VTDI), School of Applied Technology  
**Course:** Dynamic Websites and Applications  
**Assignment:** Module 1 — Assignment #1  
**Lecturer:** Trevoir Williams  
**Repository:** Add the GitHub URL after publishing.

## Project overview
Kingston Eats is a three-page, responsive restaurant discovery website built for a frontend development assignment. It showcases six **fictional** Kingston-inspired restaurant brands. Visitors can browse menus, search and sort restaurants, choose dining arrangements and prepare a demonstration reservation request.

**Target audience:** residents, tourists, couples, families and food enthusiasts looking for a curated Kingston-inspired dining experience.

## Pages
- `index.html`: homepage, featured top-rated restaurants, FAQ accordion and featured dining picks.
- `restaurants.html`: restaurant directory with live search, cuisine/neighbourhood filters, sorting and detailed menu modal.
- `reservation.html`: restaurant selection, menu preview, seating, guest count, occasion, date/time, client-side validation and request preview.

## Technologies and assignment coverage
- **HTML5:** semantic structure, headings, navigation, labels, accessible controls and three linked pages.
- **CSS3:** custom crimson/wine/ivory/apricot theme and responsive visual styling.
- **Bootstrap 5.3.3:** responsive navbar, grid, cards, form controls, buttons, modal, accordion and collapse.
- **JavaScript:** `const` and `let`, strings/numbers/booleans, arrays/objects, conditions, functions, iteration, DOM updates and event listeners.
- **jQuery 3.7.1:** restaurant-directory live search event and result-count animation.
- **Git/GitHub:** version history and assignment submission.

## Folder structure
```text
kingston-eats/
├── index.html
├── restaurants.html
├── reservation.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   └── app.js
├── IMAGE_CREDITS.md
├── README.md
├── GITHUB_SETUP.md
├── SUBMISSION_DETAILS.md
├── TESTING_CHECKLIST.md
├── .gitignore
└── .gitattributes
```

## How to run
1. Open the extracted project folder in Visual Studio Code.
2. Install the **Live Server** extension (if not installed).
3. Right-click `index.html` and choose **Open with Live Server**.
4. Browse all pages and test the features listed in `TESTING_CHECKLIST.md`.

No database, build tools or server-side application is needed. Internet is required for Bootstrap, jQuery and externally hosted images.

## Planning and design decisions
The website uses three pages to meet the assignment's required landing, exploration and interaction workflow. Restaurant objects and menu arrays are stored in `js/data.js` to separate content from interactive logic in `js/app.js`. The crimson, warm apricot and ivory theme creates a consistent upscale restaurant identity. Search, filters and sorting help users compare venues; a modal keeps menu exploration on the same page; a form collects a dining request and shows immediate feedback.

## Limitations and academic integrity
All restaurant names, ratings, review counts, menus and prices are **fictional demonstration data**. Restaurant images are illustrative Jamaican food photography from Wikimedia Commons; see `IMAGE_CREDITS.md` for sources and license details. The reservation form does not contact a restaurant, store submissions or confirm a booking.

**AI assistance disclosure:** AI was used to assist with website structure, styling, code generation, feature development, debugging guidance and documentation. The student is responsible for reviewing, testing, understanding and accurately representing the submitted work. Adjust this statement if necessary to reflect actual use.

## Final submission
See `GITHUB_SETUP.md` for the GitHub workflow. Make at least **five genuine, descriptive commits** documenting real development or review changes. Submit the repository URL in the lecturer's submission document, using `SUBMISSION_DETAILS.md` as a reference.
