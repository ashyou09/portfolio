import BrandIcon from '../components/BrandIcon';
import stack from '../data/stack';
import '../styles/marquee.css';

/*
 * The only marquee on the page. Motivation: the stack is breadth, not detail.
 * Nobody reads a tool list, so it moves past instead of taking a section.
 * Under reduced motion the CSS collapses it to a static wrapped row.
 */
export default function StackMarquee() {
  // Duplicated once so the -50% translate loops seamlessly.
  const loop = [...stack, ...stack];

  return (
    <div className="marquee" aria-label="Tools and frameworks I work with">
      <div className="marquee__track">
        {loop.map((item, index) => (
          <span className="marquee__item" key={`${item.slug}-${index}`} aria-hidden={index >= stack.length}>
            <BrandIcon slug={item.slug} name={item.name} size={19} />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}
