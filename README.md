# LF Cybersecurity and Infrastructure

## Project Description

LF Cybersecurity and Infrastructure is a professional cybersecurity services platform that connects two distinct audiences: individuals seeking internet security education and businesses in need of cybersecurity consulting.

The platform serves as a central hub where visitors can learn about the dangers of cyber threats through real-world news stories, explore a video course designed to teach everyday internet security practices, or inquire about consulting services to protect their business infrastructure. The site emphasizes awareness — showing users why cybersecurity matters through real incidents of hacking, data breaches, and identity theft — while offering practical solutions through education and professional services.

Built using MVC architecture, Node.js, Express, EJS, and PostgreSQL. Deployed on Render.

## Database Schema

![ERD](C:\Users\Luan\Desktop\Projects\My%20Website\LF-Cybersecurity-and-Infrastructure-\ERD.png)

Tables: users, companies, consultations, consultation_notes, reviews, tickets, ticket_responses, news_articles, site_content.

## User Roles

There are three roles in the system:

**Admin** — Has full access to everything. Can manage users (change roles, activate/deactivate accounts), create and publish news articles, review and respond to support tickets, manage consultation requests and update their status, approve or flag user reviews, and edit the site's dynamic content through the CMS panel. Basically the owner of the platform.

**Company** — This is the business client role. Company users have their own dashboard where they can submit cybersecurity consultation requests, track the status of those requests as they move through the workflow (submitted, under review, proposal sent, in progress, completed), add notes to ongoing consultations, and manage their company profile. They can also submit support tickets and reviews like any other user.

**User** — The standard individual account. Can browse the public site, submit reviews for the course or consulting services, create support tickets, view their own submissions, and edit or delete their own content. Reviews go through an approval process before showing up publicly.

## Test Accounts

All test accounts use the password: `P@$$w0rd!`

| Role    | Email                |
| ------- | -------------------- |
| Admin   | admin@lfcyber.com    |
| Company | company@testcorp.com |
| User    | user@example.com     |

## Known Limitations

- Email notifications are not implemented. The notification preferences page exists but doesn't actually send emails — it's just a placeholder for now.
- There is no "forgot password" or password reset flow. If a user forgets their password, an admin would need to help them.
- Lists (tickets, reviews, consultations, users in admin) don't have pagination yet. Works fine with the current amount of data but would need pagination if the site scaled up.
- No file upload support for consultations or tickets — users can only submit text.
- The course itself links to an external platform (Hotmart). The site doesn't host course content directly.
