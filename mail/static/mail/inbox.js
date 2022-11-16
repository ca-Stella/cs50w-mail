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

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    // Print emails
    console.log(emails);


    emails.forEach(email => {
      const item = document.createElement('a');
      item.classList.add('list-group-item', 'flex-column', 'align-items-start');
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
        person.innerHTML = `To: ${email['sender']}`
      }
      item.append(person);

      item.addEventListener('click', function() {
          console.log('This element has been clicked!')
      });
      document.querySelector('#emails-view').append(item);
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