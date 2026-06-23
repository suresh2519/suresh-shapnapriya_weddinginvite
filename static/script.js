const envWrap = document.getElementById('envWrap');
const invite = document.getElementById('invite');
const envCard = document.getElementById('envCard');
const cursor = document.getElementById('cursor');
const successBox = document.getElementById('successBox');
const rsvpForm = document.getElementById('rsvpForm');
const regretBtn = document.getElementById('regretBtn');

function updateCursor(event) {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
}

document.addEventListener('mousemove', updateCursor);

document.addEventListener('DOMContentLoaded', () => {
  const petalWrap = document.getElementById('petal-wrap');
  const emojis = ['🌸', '🌺', '🍃', '🌿', '🪷', '✨'];
  for (let i = 0; i < 12; i += 1) {
    const petal = document.createElement('div');
    petal.className = 'fp';
    petal.textContent = emojis[i % emojis.length];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
    petal.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
    petal.style.setProperty('--dx2', `${(Math.random() - 0.5) * 40}px`);
    petal.style.animationDuration = `${10 + Math.random() * 12}s`;
    petal.style.animationDelay = `${Math.random() * 3}s`;
    petalWrap.appendChild(petal);
  }

  document.querySelectorAll('.sec').forEach(section => section.classList.add('hidden-section'));
  requestAnimationFrame(() => {
    document.querySelectorAll('.sec').forEach((section, index) => {
      section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      section.style.transitionDelay = `${index * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {threshold: 0.16});
  document.querySelectorAll('.sec').forEach(sec => observer.observe(sec));
});

const openAudio = document.getElementById('openAudio');
if (openAudio) {
  openAudio.loop = true;
}

function openInvitation() {
  envWrap.classList.toggle('opening');
  if (invite.style.display !== 'block') {
    invite.style.display = 'block';
    setTimeout(() => invite.scrollIntoView({behavior: 'smooth'}), 850);
  }
  if (openAudio) {
    if (openAudio.paused) {
      openAudio.currentTime = 0;
      openAudio.play().catch(() => {
        // autoplay may be blocked until user interacts; click already qualifies on most browsers
      });
    }
  }
}

envWrap.addEventListener('click', openInvitation);

envWrap.addEventListener('keypress', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    openInvitation();
  }
});

function startCountdown() {
  const target = new Date('2026-06-25T07:30:00');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function update() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      clearInterval(timer);
      return;
    }
    const days = String(Math.floor(diff / 86400000)).padStart(2, '0');
    const hours = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
  }

  update();
  const timer = setInterval(update, 1000);
}

rsvpForm.addEventListener('submit', event => {
  event.preventDefault();
  
  // Get CSRF token from the form
  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  
  // Collect form data
  const formData = {
    name: document.querySelector('input[name="name"]').value,
    phone: document.querySelector('input[name="phone"]').value,
    guests: document.querySelector('select[name="guests"]').value,
    wishes: document.querySelector('textarea[name="wishes"]').value
  };
  
  // Send data to backend
  fetch('/submit/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    rsvpForm.style.display = 'none';
    successBox.style.display = 'block';
    successBox.innerHTML = '<p>' + (data.message || 'Thank you! Your response has been noted.') + '</p>';
  })
  .catch(error => {
    console.error('Error:', error);
    successBox.style.display = 'block';
    successBox.innerHTML = '<p style="color: red;">Error submitting RSVP. Please try again.</p>';
  });
});

regretBtn.addEventListener('click', () => {
  rsvpForm.style.display = 'none';
  successBox.style.display = 'block';
  successBox.innerHTML = '<p>We are sorry you can’t join us. Sending love and blessings.</p>';
});

startCountdown();
