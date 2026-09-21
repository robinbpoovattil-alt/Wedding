# Robin & Shresta — Wedding Website

An infinite-scroll, minimalist and romantic wedding microsite.

## Event
- Groom: Dr. Robin B Poovattil
- Bride: Dr. Shresta Anna Jayan
- Date: 28 November 2026
- Ceremony: 10:30 AM
- Location: Lourdes Forane Church, PMG Pattom

## Adding photographs

Put your images in `assets/photos/` and replace the placeholder `<div class="photo-placeholder">` blocks in `index.html` with `<img>` elements.

Example:

```html
<div class="photo-placeholder">
  <img src="assets/photos/robin-shresta-01.jpg" alt="Robin and Shresta">
</div>
```

Then add:

```css
.photo-placeholder img {
  width:100%;
  height:100%;
  object-fit:cover;
}
```

## GitHub Pages

Push the contents of this folder to the `Wedding` repository and enable GitHub Pages from the repository's Pages settings, using the branch containing `index.html`.

The site is plain HTML/CSS/JavaScript, so it does not require a build step.

## Planned customisation

- Replace all photo placeholders with your photographs.
- Add engagement/pre-wedding story copy.
- Add reception details when available.
- Add RSVP form/link.
- Add optional wedding music.
- Add any family names or additional ceremonies.

