import brandIcons from './brandIcons';

/**
 * Renders a brand mark from simple-icons by export name (e.g. "siPython").
 * Falls back to the plain wordmark when a slug is missing, so a bad slug
 * never blanks out a row.
 */
export default function BrandIcon({ slug, name, size = 20, tone = 'currentColor' }) {
  const icon = brandIcons[slug];

  if (!icon) {
    return <span className="brand-icon-fallback mono">{name}</span>;
  }

  // Several brand hexes are near-black, which disappears on this page.
  // Those fall back to the text colour instead of rendering an invisible mark.
  const brandHex = `#${icon.hex}`;
  const luminance = parseInt(icon.hex.slice(0, 2), 16) * 0.299
    + parseInt(icon.hex.slice(2, 4), 16) * 0.587
    + parseInt(icon.hex.slice(4, 6), 16) * 0.114;
  const fill = tone === 'brand' && luminance > 70 ? brandHex : tone === 'brand' ? 'currentColor' : tone;

  return (
    <svg role="img" aria-label={name || icon.title} viewBox="0 0 24 24" width={size} height={size} fill={fill}>
      <path d={icon.path} />
    </svg>
  );
}
