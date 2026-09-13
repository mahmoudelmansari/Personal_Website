/* =====================================================================
   works.js — builds the Works page from SECTIONS in works-data.js
   ---------------------------------------------------------------------
   You shouldn't need to edit this file to add work. Edit works-data.js.
   ===================================================================== */

(function () {
  'use strict';

  var list  = document.getElementById('sections');
  var jumps = document.getElementById('jumpList');
  if (!list || !jumps || typeof SECTIONS === 'undefined') return;

  /* -----------------------------------------------------------------
     small helpers
     ----------------------------------------------------------------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function ytThumb(id) {
    return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
  }

  /* -----------------------------------------------------------------
     Custom scrollbar, same approach as the About page: the native bar
     is hidden in CSS because ::-webkit-scrollbar can't be skewed, and
     this drives a styled stand-in in its place.
     ----------------------------------------------------------------- */
  function attachScroll(pane, rail, thumb) {
    var MIN_THUMB = 0.18;

    function sync() {
      var over = pane.scrollHeight - pane.clientHeight;

      if (over <= 1) {
        rail.classList.remove('is-live');
        return;
      }
      rail.classList.add('is-live');

      var ratio = Math.max(pane.clientHeight / pane.scrollHeight, MIN_THUMB);
      thumb.style.height = (ratio * 100) + '%';
      thumb.style.top = ((pane.scrollTop / over) * (1 - ratio) * 100) + '%';
    }

    pane.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    if (window.ResizeObserver) new ResizeObserver(sync).observe(pane);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);

    var dragging = false, grabY = 0, from = 0;

    thumb.addEventListener('pointerdown', function (e) {
      dragging = true;
      grabY = e.clientY;
      from = pane.scrollTop;
      thumb.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    thumb.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var travel = rail.clientHeight - thumb.offsetHeight;
      if (travel <= 0) return;
      pane.scrollTop = from + ((e.clientY - grabY) / travel) *
                       (pane.scrollHeight - pane.clientHeight);
    });
    var stop = function (e) {
      if (!dragging) return;
      dragging = false;
      if (e.pointerId !== undefined && thumb.hasPointerCapture(e.pointerId)) {
        thumb.releasePointerCapture(e.pointerId);
      }
    };
    thumb.addEventListener('pointerup', stop);
    thumb.addEventListener('pointercancel', stop);

    rail.addEventListener('pointerdown', function (e) {
      if (e.target === thumb) return;
      var box = rail.getBoundingClientRect();
      pane.scrollTop = ((e.clientY - box.top) / box.height) *
                       (pane.scrollHeight - pane.clientHeight);
    });

    sync();
  }

  /* -----------------------------------------------------------------
     Horizontal row that scrolls by whole items, with arrows that only
     appear once the row actually overflows. Same behaviour as the
     skills row on the About page.
     ----------------------------------------------------------------- */
  function attachRowScroll(wrap, row, prev, next) {
    function refresh() {
      var over = row.scrollWidth - row.clientWidth;
      wrap.classList.toggle('is-scrollable', over > 1);
      if (over <= 1) return;
      prev.disabled = row.scrollLeft <= 1;
      next.disabled = row.scrollLeft >= over - 1;
    }

    function nudge(dir) {
      var items = row.children, i;
      if (dir > 0) {
        var edge = row.scrollLeft + row.clientWidth;
        for (i = 0; i < items.length; i++) {
          if (items[i].offsetLeft + items[i].offsetWidth > edge + 1) {
            row.scrollLeft = items[i].offsetLeft;
            return;
          }
        }
        row.scrollLeft = row.scrollWidth;
      } else {
        for (i = items.length - 1; i >= 0; i--) {
          if (items[i].offsetLeft < row.scrollLeft - 1) {
            row.scrollLeft = Math.max(0,
              items[i].offsetLeft + items[i].offsetWidth - row.clientWidth);
            return;
          }
        }
        row.scrollLeft = 0;
      }
    }

    prev.addEventListener('click', function () { nudge(-1); });
    next.addEventListener('click', function () { nudge(1); });
    row.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh);
    if (window.ResizeObserver) new ResizeObserver(refresh).observe(row);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    refresh();
  }

  /* -----------------------------------------------------------------
     Inline colour markup for descriptions.

       [yellow]Teleportation[/]  ->  coloured span

     Available names are the .tint--* classes in works.css:
     yellow, red, violet, white. Text is inserted as a text node, so
     nothing in the data file can inject markup.
     ----------------------------------------------------------------- */
  var TINT = /\[(\w+)\]([\s\S]*?)\[\/\]/g;

  function appendRich(parent, text) {
    var last = 0, m;
    TINT.lastIndex = 0;

    while ((m = TINT.exec(text)) !== null) {
      if (m.index > last) {
        parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      }
      var span = el('span', 'tint tint--' + m[1], m[2]);
      parent.appendChild(span);
      last = TINT.lastIndex;
    }
    if (last < text.length) {
      parent.appendChild(document.createTextNode(text.slice(last)));
    }
  }

  /* An image that degrades to a labelled placeholder instead of a
     broken-image icon, so the page still reads while assets are being
     gathered. */
  function safeImage(src, alt, label) {
    var wrap = el('div', 'shot-slot');
    var img = el('img');
    img.src = src || '';
    img.alt = alt || '';
    img.loading = 'lazy';
    img.addEventListener('error', function () {
      wrap.classList.add('is-missing');
      wrap.setAttribute('data-label', label || alt || 'Image');
      img.remove();
    });
    if (!src) img.dispatchEvent(new Event('error'));
    wrap.appendChild(img);
    return wrap;
  }

  /* -----------------------------------------------------------------
     one showcase entry (a project, a video series, an art set)
     ----------------------------------------------------------------- */
  function buildEntry(entry) {
    var block = el('article', 'show');

    /* ---- left: the written half ---- */
    var info = el('div', 'show-info');

    var h3 = el('h3', 'show-title');
    h3.appendChild(el('span', 'show-title-main', entry.title));
    if (entry.titleAccent) {
      h3.appendChild(el('span', 'show-title-accent', entry.titleAccent));
    }
    info.appendChild(h3);

    /* the description sits in its own tilted panel, like the About
       page's bio box. Tags go BELOW it, outside the panel. */
    var infoBox = el('div', 'info-box');

    var descWrap = el('div', 'desc-wrap');
    var desc = el('div', 'show-desc');

    /* Description can be one string or an array of strings.
       In a string:
         \n    = line break, lines stay tight together
         \n\n  = new paragraph, with a gap between blocks
       An array always gives one paragraph per item. */
    var paras = Array.isArray(entry.description)
      ? entry.description
      : String(entry.description || '').split(/\n\s*\n/);

    paras.forEach(function (text) {
      var t = text.trim();
      if (!t) return;

      var p = el('p');
      t.split('\n').forEach(function (line, i) {
        if (i) p.appendChild(document.createElement('br'));
        appendRich(p, line.trim());
      });
      desc.appendChild(p);
    });
    var descRail = el('div', 'desc-scroll');
    var descThumb = el('span', 'desc-thumb');
    descRail.appendChild(descThumb);
    descWrap.appendChild(desc);
    descWrap.appendChild(descRail);
    infoBox.appendChild(descWrap);
    info.appendChild(infoBox);
    attachScroll(desc, descRail, descThumb);

    if (entry.tags && entry.tags.length) {
      var tagWrap = el('div', 'tags-wrap');

      var tPrev = el('button', 'tags-arrow tags-arrow--prev');
      tPrev.type = 'button';
      tPrev.setAttribute('aria-label', 'Scroll tags left');
      tPrev.innerHTML = '<svg viewBox="0 0 32 40" aria-hidden="true">' +
                        '<polygon points="30,0 0,17 26,40 19,18"/></svg>';

      var tags = el('ul', 'show-tags');
      entry.tags.forEach(function (t) { tags.appendChild(el('li', null, t)); });

      var tNext = el('button', 'tags-arrow tags-arrow--next');
      tNext.type = 'button';
      tNext.setAttribute('aria-label', 'Scroll tags right');
      tNext.innerHTML = '<svg viewBox="0 0 32 40" aria-hidden="true">' +
                        '<polygon points="2,0 32,17 6,40 13,18"/></svg>';

      tagWrap.appendChild(tPrev);
      tagWrap.appendChild(tags);
      tagWrap.appendChild(tNext);
      info.appendChild(tagWrap);
      attachRowScroll(tagWrap, tags, tPrev, tNext);
    }

    /* The whole bottom-right cluster — button, note and arrow — only
       appears when the entry has a CTA with a label. Leave cta out (or
       give it an empty label) for a project with nothing to link to. */
    var ctaNode = null;
    if (entry.cta && entry.cta.label && String(entry.cta.label).trim()) {
      var ctaHold = el('div', 'cta-hold');

      /* optional handwritten note + arrow pointing at the button.
         Edit the `note:` field in works-data.js, or delete it to hide. */
      if (entry.note) {
        var cNote = el('span', 'cta-note');
        cNote.setAttribute('aria-hidden', 'true');

        /* line breaks come from the note itself: put \n wherever you
           want the text to wrap, e.g. note: 'Try it\nout!' */
        var words = el('span', 'cta-note-text');
        String(entry.note).split('\n').forEach(function (line, i) {
          if (i) words.appendChild(document.createElement('br'));
          words.appendChild(document.createTextNode(line.trim()));
        });
        cNote.appendChild(words);
        var curve = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        curve.setAttribute('viewBox', '0 0 40 34');
        curve.classList.add('cta-note-arrow');
        curve.innerHTML =
          '<path d="M4 3 C 20 6, 30 14, 32 24" fill="none" ' +
          'stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>' +
          '<polygon points="25,21 38,32 34,17" fill="currentColor"/>';
        cNote.appendChild(curve);
        ctaHold.appendChild(cNote);
      }

      var cta = el('a', 'show-cta');
      cta.href = entry.cta.href || '#';
      if (/^https?:/.test(entry.cta.href || '')) {
        cta.target = '_blank';
        cta.rel = 'noopener';
      }
      cta.appendChild(el('span', null, entry.cta.label));
      var arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('viewBox', '0 0 32 40');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.classList.add('show-cta-arrow');
      var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', '2,0 32,17 6,40 13,18');
      arrow.appendChild(poly);
      cta.appendChild(arrow);

      ctaHold.appendChild(cta);
      ctaNode = ctaHold;   // appended to the block below, not to .show-info,
                           // so it can pin to the block's bottom-right corner
    }

    block.appendChild(info);

    /* ---- right: the media half ---- */
    var media = entry.media || [];
    var stageWrap = el('div', 'show-media');

    /* frame and arrows share a wrapper so the arrows can centre on the
       frame rather than on the frame-plus-dots block */
    var hold = el('div', 'stage-hold');
    var stage = el('div', 'stage-frame');
    hold.appendChild(stage);
    stageWrap.appendChild(hold);

    var prev = el('button', 'stage-arrow stage-arrow--prev');
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous item');
    prev.innerHTML = '<svg viewBox="0 0 32 40" aria-hidden="true">' +
                     '<polygon points="30,0 0,17 26,40 19,18"/></svg>';

    var next = el('button', 'stage-arrow stage-arrow--next');
    next.type = 'button';
    next.setAttribute('aria-label', 'Next item');
    next.innerHTML = '<svg viewBox="0 0 32 40" aria-hidden="true">' +
                     '<polygon points="2,0 32,17 6,40 13,18"/></svg>';

    hold.appendChild(prev);
    hold.appendChild(next);

    var strip = el('ul', 'show-dots');
    stageWrap.appendChild(strip);

    block.appendChild(stageWrap);
    if (ctaNode) block.appendChild(ctaNode);

    /* ---- carousel behaviour ---- */
    var at = 0;

    function paint() {
      stage.innerHTML = '';
      var item = media[at];
      if (!item) return;

      if (item.type === 'youtube') {
        var poster = el('div', 'stage-video');
        var src = item.thumb || (item.id ? ytThumb(item.id) : '');
        poster.appendChild(safeImage(src, item.alt, item.alt));

        var play = el('button', 'stage-play');
        play.type = 'button';
        play.setAttribute('aria-label', 'Play ' + (item.alt || 'video'));
        play.innerHTML = '<svg viewBox="0 0 60 60" aria-hidden="true">' +
                         '<circle cx="30" cy="30" r="28"/>' +
                         '<polygon points="24,17 46,30 24,43"/></svg>';

        // the iframe is only created on click, so YouTube isn't loaded
        // (and can't set cookies) unless the visitor asks for it
        play.addEventListener('click', function () {
          if (!item.id) return;
          var frame = document.createElement('iframe');
          frame.src = 'https://www.youtube-nocookie.com/embed/' + item.id + '?autoplay=1';
          frame.title = item.alt || 'Video';
          frame.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
          frame.allowFullscreen = true;
          frame.className = 'stage-frame-video';
          stage.innerHTML = '';
          stage.appendChild(frame);
        });

        poster.appendChild(play);
        stage.appendChild(poster);
      } else {
        stage.appendChild(safeImage(item.src, item.alt, item.alt));
      }

      Array.prototype.forEach.call(strip.children, function (li, i) {
        li.classList.toggle('is-active', i === at);
        var b = li.querySelector('button');
        if (b) b.setAttribute('aria-current', i === at ? 'true' : 'false');
      });

      var single = media.length < 2;
      prev.hidden = single;
      next.hidden = single;
      strip.hidden = single;
    }

    media.forEach(function (item, i) {
      var li = el('li');
      var b = el('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show ' + (item.alt || 'item ' + (i + 1)));
      b.addEventListener('click', function () { at = i; paint(); });
      li.appendChild(b);
      strip.appendChild(li);
    });

    prev.addEventListener('click', function () {
      at = (at - 1 + media.length) % media.length;
      paint();
    });
    next.addEventListener('click', function () {
      at = (at + 1) % media.length;
      paint();
    });

    paint();
    return block;
  }

  /* -----------------------------------------------------------------
     build everything
     ----------------------------------------------------------------- */
  SECTIONS.forEach(function (sec) {
    var band = el('section', 'band');
    band.id = sec.id;

    var head = el('header', 'band-head');

    var title = el('h2', 'band-title');
    title.appendChild(el('span', null, sec.title));
    head.appendChild(title);

    head.appendChild(el('p', 'band-blurb', sec.blurb));
    band.appendChild(head);

    (sec.entries || []).forEach(function (entry) {
      band.appendChild(buildEntry(entry));
    });

    list.appendChild(band);

    /* matching jump plate */
    var li = el('li');
    var a = el('a', 'nav-btn');
    a.href = '#' + sec.id;
    a.appendChild(el('span', null, sec.title));
    li.appendChild(a);
    li.style.setProperty('--tilt', (sec.num % 2 ? '-2deg' : '1.6deg'));
    li.style.setProperty('--slide', '0');
    jumps.appendChild(li);
  });

  /* -----------------------------------------------------------------
     highlight the section you're looking at
     ----------------------------------------------------------------- */
  var plates = Array.prototype.slice.call(jumps.querySelectorAll('.nav-btn'));
  var bands  = Array.prototype.slice.call(list.querySelectorAll('.band'));

  if ('IntersectionObserver' in window && plates.length === bands.length) {
    var spy = new IntersectionObserver(function (rows) {
      rows.forEach(function (row) {
        if (!row.isIntersecting) return;
        var i = bands.indexOf(row.target);
        plates.forEach(function (p, n) {
          p.classList.toggle('is-active', n === i);
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    bands.forEach(function (b) { spy.observe(b); });
  }
})();
