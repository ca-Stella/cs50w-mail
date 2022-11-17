document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_email;

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    // Print emails
    console.log(emails);
    const listgroup = document.createElement('div');
    listgroup.classList.add('list-group');
    document.querySelector('#emails-view').append(listgroup);

    emails.forEach(email => {
      const item = document.createElement('a');
      item.classList.add('list-group-item', 'flex-column', 'align-items-start');
      if (email['read'] == true) {
        item.classList.add('read-email')
      }
      listgroup.append(item);
      // item.setAttribute('href',`${email['id']}`);

      const top = document.createElement('div');
      top.classList.add('d-flex','w-100','justify-content-between');
      item.append(top);

      const title = document.createElement('h3');
      title.innerHTML = email['subject'];
      top.append(title);

      const timestamp = document.createElement('small');
      timestamp.innerHTML = email['timestamp'];
      top.append(timestamp);

      const person = document.createElement('p');
      if (mailbox == 'sent') {
        person.innerHTML = `To: ${email['recipients']}`;
      }
      else {
        person.innerHTML = `From: ${email['sender']}`
      }
      item.append(person);

      item.addEventListener('click', function() {
          fetch(`/emails/${email['id']}`)
          .then(response => response.json())
          .then(email => {
              load_email(email);
          });
      });
    });
  });
}

function send_email() {
  const recipient = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipient,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    load_mailbox('sent');
    console.log(result);
  });
  
  return false;
}

function load_email(email) {
  // Show the email and hide other views
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  const subject = document.createElement('h3');
  subject.innerHTML = email['subject']
  subject.classList.add('email-subject');
  document.querySelector('#email-view').append(subject);

  const timestamp = document.createElement('p');
  timestamp.innerHTML = email['timestamp'];
  document.querySelector('#email-view').append(timestamp);

  const sender = document.createElement('p');
  sender.innerHTML = `From: ${email['sender']}`
  document.querySelector('#email-view').append(sender);

  const recipient = document.createElement('p');
  recipient.innerHTML = `To: ${email['recipients']}`;
  document.querySelector('#email-view').append(recipient);

  const body = document.createElement('p');
  body.innerHTML = `${email['body']}`;
  document.querySelector('#email-view').append(body);

}