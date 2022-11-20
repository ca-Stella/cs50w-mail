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

  // Fetch all the emails in the mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    // make an emails-view list-group
    // console.log(emails);
    const listgroup = document.createElement('div');
    listgroup.classList.add('list-group');
    document.querySelector('#emails-view').append(listgroup);

    // For each email, show information
    emails.forEach(email => {
      const item = document.createElement('a');
      item.classList.add('list-group-item', 'flex-column', 'align-items-start');
      if (email['read'] == true) {
        item.classList.remove('unread-email')
        item.classList.add('read-email')
      } else {
        item.classList.remove('read-email')
        item.classList.add('unread-email')
      }
      listgroup.append(item);

      // Create top area with title and timestamp
      const top = document.createElement('div');
      top.classList.add('d-flex','w-100','justify-content-between');
      item.append(top);

      const title = document.createElement('h3');
      title.innerHTML = email['subject'];
      top.append(title);

      const timestamp = document.createElement('small');
      timestamp.innerHTML = email['timestamp'];
      top.append(timestamp);

      // Show the sender/receiver of the email received/sent
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
              load_email(email, mailbox);
          });
      });
    });
  });
}

function send_email() {
  const recipient = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Send email with POST and load sent mailbox
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

function load_email(email, mailbox) {
  // Show the email and hide other views
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').innerHTML = '';

  // Create the subject heading
  const subject = document.createElement('h3');
  subject.innerHTML = email['subject']
  subject.classList.add('email-subject');
  document.querySelector('#email-view').append(subject);

  // Show timestamp
  const timestamp = document.createElement('p');
  timestamp.innerHTML = email['timestamp'];
  document.querySelector('#email-view').append(timestamp);

  // Show sender
  const sender = document.createElement('p');
  sender.innerHTML = `From: ${email['sender']}`
  document.querySelector('#email-view').append(sender);

  // Show recipient
  const recipient = document.createElement('p');
  recipient.innerHTML = `To: ${email['recipients']}`;
  document.querySelector('#email-view').append(recipient);

  // Show the body of the email
  const body = document.createElement('p');
  body.innerHTML = `${email['body']}`;
  document.querySelector('#email-view').append(body);

  // Change read status of email
  fetch(`/emails/${email['id']}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

  // Add archive/un-archive button
  const archive = document.createElement('button');
  if (mailbox == 'archive') {
    archive.setAttribute('id','un-archive-action');
    archive.innerHTML = 'un-archive';
  } else if (mailbox == 'inbox') {
    archive.setAttribute('id','archive-action');
    archive.innerHTML = 'archive';
  } else {
    archive.style.display = 'none';
  }
  document.querySelector('#email-view').append(archive);

  // Change archive status based on button press
  archive.addEventListener('click', function() {
    fetch(`/emails/${email['id']}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: mailbox == 'archive' ? false : true
      })
    })
    .then(result => {
      load_mailbox('inbox');
    });
  });

  // Create reply button that calls reply_email when pressed
  const reply = document.createElement('button');
  reply.innerHTML = 'Reply';
  document.querySelector('#email-view').append(reply)
  reply.addEventListener('click', function() {
    reply_email(email);
  });
}

function reply_email(email) {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Fill out composition fields
  document.querySelector('#compose-recipients').value = `${email['sender']}`;
  document.querySelector('#compose-body').value = `On ${email['timestamp']} ${email['sender']} wrote: 
        ${email['body']}`;

  // Make the subject of the email without repetitions of Re:'s
  let main_subject = email['subject'];
  if (email['subject'].includes('Re: ')) {
    main_subject = email['subject'].slice(email['subject'].lastIndexOf('Re: ')+4);
  } 
  document.querySelector('#compose-subject').value = `Re: ${main_subject}`;
}