# tutrhq

### Description
This is the backend repository for Tutor. It will render the different HTML pages and keep track of all of our email subscriptions.

### Installation Steps:
- `sudo apt-get install npm`
- `sudo apt-get install nodejs`
- `npm install express` [for routing]
- `npm install formidable` [for getting form data]

### To Run :
- `nodejs server.js`

### TODO:
- Make the html pages not look shitty
- Use `MongoDB` or some other database to store all of the emails
- Check that the email sent to us is well-formed and does not already exist in the database
- Send users a verification email using `SendGrid`?

