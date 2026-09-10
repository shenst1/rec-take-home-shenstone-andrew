# Rec Technologies - SWE Take Home Project

**Context:** A parks & recreation department runs programs - swimming lessons, basketball camps, art classes, senior fitness. Each program has one or more sections (think "Swim Level 2, Tuesdays 4-5pm" vs. "Swim Level 2, Thursdays 4-5pm") with limited capacity. They need a registration system. Below is what we know. Some of it is contradictory. Part of your job is to figure out what to actually build.

**Core requirement:** Parents can browse programs and register their children for sections online. Sections have capacity limits. When a section is full, there should be a waitlist.

**Considerations:**

- *Age-gated sections.* Some sections restrict by age (e.g., "Swim Level 2: ages 6-8").
- *Household registration.* Parents register multiple children, often for the same program.
- *Waitlist fairness.* When a spot opens, who gets it?

**Stakeholder requests:**

- Automatic waitlist promotion: when someone drops, the next person on the waitlist is auto-registered and charged.
- Sibling discount: 10% off the second child, 20% off the third.
- Registration opens at a specific date/time per program.  
**

**Your job:** We suggest taking 2 hours. You cannot and should not build everything above. Choose what to build, what to defer, and what to push back on. We want to see your judgment.

**What to deliver:**

A working implementation (API, CLI, and/or simple UI - your choice)

- **A README explaining**: what you built and why, what you deferred and why, what you'd push back on and why, and what you'd do next with more time
- **A "Tools & Process" section** in your README documenting which AI tools you used, how you used them, and any notable moments where you overrode or corrected the AI
- A **5-minute Loom video** walking through your key decisions and how you used AI tools. Screen-share your code. You don't have to narrate every line, just focus on the interesting choices. Polish doesn't matter, but clarity of thought does.

---

**Tech stack:** Use whatever you're comfortable with. Our stack is TypeScript/Node.js/PostgreSQL/React, but we won't penalize other choices.

**Data layer:** You don't need to set up Postgres or any external database. SQLite is recommended. An in-memory data store (Maps, arrays, plain objects) with clean types is also acceptable. What matters is that your data model is visible and your system actually runs. We want to see how you think about schema, infrastructure skills are not required for this.