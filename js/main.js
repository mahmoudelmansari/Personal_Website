/* =====================================================================
   main.js — shared behaviour
   Kept deliberately small. No framework, no build step.
   ===================================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------------
     Entrance sequence.
     CSS holds everything at opacity:0 until <body> gets .is-ready,
     so the page never flashes half-animated content. We wait for
     fonts where possible, because Anton loading late would otherwise
     make the name block jump mid-animation.
     ------------------------------------------------------------- */
  function start() {
    document.body.classList.add('is-ready');
  }

  if (document.fonts && document.fonts.ready) {
    // don't let a slow font CDN hold the page hostage
    var released = false;
    var release = function () {
      if (!released) { released = true; start(); }
    };
    document.fonts.ready.then(release);
    setTimeout(release, 1200);
  } else {
    start();
  }

  /* -------------------------------------------------------------
     Keyboard navigation for the menu plates.
     Up/Down move between items, matching how a game menu behaves.
     ------------------------------------------------------------- */
  var plates = Array.prototype.slice.call(
    document.querySelectorAll('.nav-btn')
  );

  if (plates.length) {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

      var here = plates.indexOf(document.activeElement);
      if (here === -1) {
        plates[0].focus();
      } else {
        var step = e.key === 'ArrowDown' ? 1 : -1;
        var next = (here + step + plates.length) % plates.length;
        plates[next].focus();
      }
      e.preventDefault();
    });
  }

  /* -------------------------------------------------------------
     Custom scrollbar for the About page bio panel.
     A native scrollbar can't be skewed, so the real one is hidden in
     CSS and this drives a styled stand-in: size the thumb by how much
     of the text is visible, position it by how far we've scrolled,
     and let it be dragged.
     ------------------------------------------------------------- */
  var bio   = document.querySelector('.bio');
  var rail  = document.querySelector('.bio-scroll');
  var thumb = document.querySelector('.bio-thumb');

  if (bio && rail && thumb) {

    var MIN_THUMB = 0.12;   // never let the thumb shrink to a sliver

    function sync() {
      var over = bio.scrollHeight - bio.clientHeight;

      // nothing to scroll: hide the rail entirely
      if (over <= 1) {
        rail.classList.remove('is-live');
        return;
      }
      rail.classList.add('is-live');

      var ratio = Math.max(bio.clientHeight / bio.scrollHeight, MIN_THUMB);
      var travel = 1 - ratio;
      var at = bio.scrollTop / over;

      thumb.style.height = (ratio * 100) + '%';
      thumb.style.top    = (at * travel * 100) + '%';
    }

    bio.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);

    // re-measure if the text itself changes size
    if (window.ResizeObserver) new ResizeObserver(sync).observe(bio);

    /* dragging ------------------------------------------------- */
    var dragging = false, grabY = 0, startScroll = 0;

    thumb.addEventListener('pointerdown', function (e) {
      dragging = true;
      grabY = e.clientY;
      startScroll = bio.scrollTop;
      thumb.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    thumb.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var railH = rail.clientHeight - thumb.offsetHeight;
      if (railH <= 0) return;
      var moved = (e.clientY - grabY) / railH;
      bio.scrollTop = startScroll + moved * (bio.scrollHeight - bio.clientHeight);
    });

    var endDrag = function (e) {
      if (!dragging) return;
      dragging = false;
      if (e.pointerId !== undefined && thumb.hasPointerCapture(e.pointerId)) {
        thumb.releasePointerCapture(e.pointerId);
      }
    };
    thumb.addEventListener('pointerup', endDrag);
    thumb.addEventListener('pointercancel', endDrag);

    /* click the rail to jump ----------------------------------- */
    rail.addEventListener('pointerdown', function (e) {
      if (e.target === thumb) return;
      var box = rail.getBoundingClientRect();
      var at = (e.clientY - box.top) / box.height;
      bio.scrollTop = at * (bio.scrollHeight - bio.clientHeight);
    });

    sync();
  }

  /* -------------------------------------------------------------
     Skills row: a single line that scrolls sideways once there are
     more tags than fit. The arrows stay hidden entirely while
     everything fits, so a short list looks exactly as it does now.
     ------------------------------------------------------------- */
  var skills = document.querySelector('.skills');
  var skillsWrap = document.querySelector('.skills-wrap');

  if (skills && skillsWrap) {
    var prev = skillsWrap.querySelector('.skills-arrow--prev');
    var next = skillsWrap.querySelector('.skills-arrow--next');

    function refresh() {
      var over = skills.scrollWidth - skills.clientWidth;

      skillsWrap.classList.toggle('is-scrollable', over > 1);
      if (over <= 1) return;

      // 1px of slack: browsers round sub-pixel scroll positions
      prev.disabled = skills.scrollLeft <= 1;
      next.disabled = skills.scrollLeft >= over - 1;
    }

    /* Step by whole tags rather than by a fixed distance, so a tag is
       never left half-cut at the edge. Going forward, the first tag
       that isn't fully visible becomes the new left-most one; going
       back, the last tag off to the left is parked against the right
       edge. */
    function nudge(dir) {
      var items = skills.children;
      var i;

      if (dir > 0) {
        var rightEdge = skills.scrollLeft + skills.clientWidth;
        for (i = 0; i < items.length; i++) {
          if (items[i].offsetLeft + items[i].offsetWidth > rightEdge + 1) {
            skills.scrollLeft = items[i].offsetLeft;
            return;
          }
        }
        skills.scrollLeft = skills.scrollWidth;   // already at the end
      } else {
        for (i = items.length - 1; i >= 0; i--) {
          if (items[i].offsetLeft < skills.scrollLeft - 1) {
            skills.scrollLeft = Math.max(
              0,
              items[i].offsetLeft + items[i].offsetWidth - skills.clientWidth
            );
            return;
          }
        }
        skills.scrollLeft = 0;
      }
    }

    prev.addEventListener('click', function () { nudge(-1); });
    next.addEventListener('click', function () { nudge(1); });

    skills.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    if (window.ResizeObserver) new ResizeObserver(refresh).observe(skills);

    refresh();
  }

  /* -------------------------------------------------------------
     Contact page: the flip card.
     Clicking the star turns the card over. aria-pressed keeps the
     state readable to a screen reader, and the details on the hidden
     face are taken out of the tab order so focus can't land on a
     link nobody can see.
     ------------------------------------------------------------- */
  var card = document.getElementById('card');
  var flip = document.querySelector('.flip');

  if (card && flip) {
    var hidden = card.querySelectorAll('.card-face--back a');

    function setFace(flipped) {
      card.classList.toggle('is-flipped', flipped);
      flip.setAttribute('aria-pressed', flipped ? 'true' : 'false');

      var front = card.querySelectorAll('.card-face--front a');
      var i;
      for (i = 0; i < hidden.length; i++) {
        hidden[i].setAttribute('tabindex', flipped ? '0' : '-1');
      }
      for (i = 0; i < front.length; i++) {
        front[i].setAttribute('tabindex', flipped ? '-1' : '0');
      }
    }

    flip.addEventListener('click', function () {
      setFace(!card.classList.contains('is-flipped'));
    });

    setFace(false);
  }
})();
