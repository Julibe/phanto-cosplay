'use strict';

const carousel = document.querySelector('.hero-showcase');
const slides = [...carousel.querySelectorAll('.hero-slide')];
const controls = carousel.querySelector('.hero-controls');
const playback = document.getElementById('hero-playback');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let index = 0;
let playing = !motion.matches;
let hovered = false;
let timer;

function scheduleSlide() {
  clearTimeout(timer);
  if (playing && !hovered && !document.hidden && !carousel.hidden && !carousel.contains(document.activeElement)) {
    timer = setTimeout(() => moveSlide(1), 4600);
  }
}

function moveSlide(direction, announce = false) {
  const oldSlide = slides[index];
  oldSlide.hidden = true;
  oldSlide.classList.remove('is-entering');
  index = (index + direction + slides.length) % slides.length;
  const slide = slides[index];
  slide.style.setProperty('--slide-entry', direction > 0 ? '22%' : '-22%');
  slide.hidden = false;
  slide.classList.add('is-entering');
  if (announce) document.getElementById('hero-announcement').textContent = slide.getAttribute('aria-label');
  scheduleSlide();
}

function setPlaying(value) {
  playing = value;
  carousel.toggleAttribute('data-paused', !playing);
  const label = playing ? 'Pause slideshow' : 'Play slideshow';
  playback.setAttribute('aria-label', label);
  playback.title = label;
  playback.querySelector('i').className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  scheduleSlide();
}

document.getElementById('hero-previous').addEventListener('click', () => moveSlide(-1, true));
document.getElementById('hero-next').addEventListener('click', () => moveSlide(1, true));
playback.addEventListener('click', () => setPlaying(!playing));
carousel.addEventListener('pointerenter', event => {
  if (event.pointerType === 'mouse') {
    hovered = true;
    scheduleSlide();
  }
});
carousel.addEventListener('pointerleave', event => {
  if (event.pointerType === 'mouse') {
    hovered = false;
    scheduleSlide();
  }
});
carousel.addEventListener('focusin', scheduleSlide);
carousel.addEventListener('focusout', () => setTimeout(scheduleSlide, 0));
document.addEventListener('visibilitychange', scheduleSlide);
document.addEventListener('portalchange', scheduleSlide);
motion.addEventListener('change', event => setPlaying(!event.matches));
controls.hidden = false;
setPlaying(playing);
