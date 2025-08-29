const canvas = document.getElementById('canvas');
const stylesForm = document.querySelector('form');
const faceColor = document.getElementById('face-color');
const borderColor = document.getElementById('border-color');
const numberLineColor = document.getElementById('line-color');
const largeHandsColor = document.getElementById('large-hand-color');
const secHandColor = document.getElementById('second-hand-color');
const hideFormBtn = document.getElementById('hide-btn');

// show edit form
function showStylesForm(e) {
  stylesForm.style.display = 'block';
  document.querySelector('h4').style.display = 'block';
  e.target.remove();
}
// hide edit form
function hideStylesForm() {
  stylesForm.style.display = 'none';
  document.querySelector('h4').style.display = 'none';
  const showFormBtn = document.createElement('button');

  showFormBtn.innerText = 'Show Clock Style Form';
  showFormBtn.addEventListener('click', showStylesForm);
  document.querySelector('.card').appendChild(showFormBtn);
}
hideFormBtn.addEventListener('click', hideStylesForm);

// create a color array
let clockStyles;
if (localStorage.getItem('clockStyles') !== null) {
  getStyles();
}

function clock(timestamp) {
  const now = new Date();

  const ctx = canvas.getContext('2d');

  // Setup
  ctx.save(); // save default state
  ctx.clearRect(0, 0, 1000, 500);
  ctx.translate(500, 250); // offset origin to [250,250]
  ctx.rotate(-Math.PI / 2); // rotate clock 90 deg counter-clockwise

  // default styles
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#f4f4f4';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';

  // Draw clock face/border
  ctx.save(); // default styles
  ctx.beginPath();
  ctx.lineWidth = 14;
  ctx.strokeStyle = borderColor.value;

  ctx.fillStyle = faceColor.value;

  ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fill();
  ctx.restore(); // default styles

  // Draw hour lines.
  ctx.save();
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.moveTo(100, 0); // segment origin
    ctx.lineTo(120, 0); // segment end
    ctx.rotate(Math.PI / 6);
    ctx.strokeStyle = numberLineColor.value;

    ctx.stroke();
  }

  ctx.restore();

  // Draw min segments.
  ctx.save();
  ctx.lineWidth = 2;
  for (let i = 0; i < 60; i++) {
    if (i % 5 !== 0) {
      ctx.beginPath();
      ctx.moveTo(115, 0); // segment origin
      ctx.lineTo(120, 0); // segment end
      ctx.strokeStyle = numberLineColor.value;

      ctx.stroke();
    }
    ctx.rotate(Math.PI / 30);
  }

  ctx.restore();

  // Get Current time

  const hr = now.getHours() % 12;
  const min = now.getMinutes();
  const sec = now.getSeconds();

  // Draw the hr hand
  ctx.save();
  ctx.rotate((Math.PI * hr) / 6 + (Math.PI * min) / 360);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-15, 0); // segment origin
  ctx.lineTo(45, 0); // segment end
  ctx.strokeStyle = largeHandsColor.value;

  ctx.stroke();
  ctx.restore();

  // Draw the min hand
  ctx.save();
  ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-15, 0); // segment origin
  ctx.lineTo(75, 0); // segment end
  ctx.strokeStyle = largeHandsColor.value;

  ctx.stroke();
  ctx.restore();

  // Draw the sec hand
  ctx.save();
  ctx.rotate((Math.PI / 30) * sec);
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(-15, 0); // segment origin
  ctx.lineTo(90, 0); // segment end
  ctx.strokeStyle = secHandColor.value;

  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = secHandColor.value;

  ctx.arc(0, 0, 7, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.restore();

  ctx.restore(); // restore default state
  requestAnimationFrame(clock);
}

requestAnimationFrame(clock);

document.getElementById('save-btn').addEventListener('click', () => {
  const clockStyles = {
    face: faceColor.value,
    border: borderColor.value,
    lines: numberLineColor.value,
    largeHands: largeHandsColor.value,
    secHand: secHandColor.value,
  };

  localStorage.setItem('clockStyles', JSON.stringify(clockStyles));
  console.log(localStorage.getItem('clockStyles'));

  const dataURL = canvas.toDataURL('image/png'); // href attribute
  const link = document.createElement('a'); // create a link
  link.download = 'clock.png'; // Set file name
  link.href = dataURL;
  link.click();
});

// Get styles from the local storage
function getStyles() {
  clockStyles = JSON.parse(localStorage.getItem('clockStyles'));
  faceColor.value = clockStyles.face;
  borderColor.value = clockStyles.border;
  numberLineColor.value = clockStyles.lines;
  largeHandsColor.value = clockStyles.largeHands;
  secHandColor.value = clockStyles.secHand;
}
