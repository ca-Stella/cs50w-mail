# CS50's Web Programming - Mail Assignment

This is an email webpage created as part of The CS50's Web Programming with Python and JavaScript course.  

[📹 Youtube demo](https://youtu.be/NSbFTwrcEBM)

## Outcomes
- Design a front-end for an email client that makes API calls to send and receive emails using JavaScript
- Learned more about how to design single page applications
- Selected and created HTML elements using JavaScript for an interactive webpage
- Implemented functions to send and receive mail, as well as to keep track of read status and archive status
- Used JavaScript to create a pre-filled email form when replying to another email
- Applied CSS styling to better user experience
- Used Git and GitHub for overall project management

### Technologies & Resources Used
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="javascript" width="30" height="30"/> &emsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="html" width="30" height="30"/> &emsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="css" width="30" height="30"/> &emsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt = "python" width="30" height="30"/> &emsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" alt="django" width="30" height="30"/> &emsp; <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="vscode" width="30" height="30"/> 

## Specifications 
- [x] When a user submits the email composition form, add JavaScript code to actually send the email.
    - [x] Once the email has been sent, load the user’s sent mailbox.
- [x] When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox. When a mailbox is visited, the application should first query the API for the latest emails in that mailbox. 
    - [x] Each email should then be rendered in its own box (e.g. a div with a border) that displays who the email is from, what the subject line is, and the timestamp of the email.
    - [x] If the email is unread, it should appear with a white background. If the email has been read, it should appear with a gray background.
- [x] When a user clicks on an email, the user should be taken to a view where they see the content of that email.
    - [x] Your application should show the email’s sender, recipients, subject, timestamp, and body.
    - [x] Once the email has been clicked on, you should mark the email as read. Recall that you can send a PUT request to /emails/email_id to update whether an email is read or not.
- [x] Allow users to archive and unarchive emails that they have received.
    - [x] When viewing an Inbox email, the user should be presented with a button that lets them archive the email. When viewing an Archive email, the user should be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.
    - [x] Once an email has been archived or unarchived, load the user’s inbox.
- [x] Allow users to reply to an email. When viewing an email, the user should be presented with a “Reply” button that lets them reply to the email.
    - [x] When the user clicks the “Reply” button, they should be taken to the email composition form.
    - [x] Pre-fill the composition form with the recipient field set to whoever sent the original email. Pre-fill the subject line. Pre-fill the body of the email with the original text of the email.