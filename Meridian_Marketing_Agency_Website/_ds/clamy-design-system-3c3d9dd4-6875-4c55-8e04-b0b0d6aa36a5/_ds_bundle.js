/* @ds-bundle: {"format":4,"namespace":"ClamyDesignSystem_3c3d9d","components":[{"name":"AccordionItem","sourcePath":"components/accordion/Accordion.jsx"},{"name":"Accordion","sourcePath":"components/accordion/Accordion.jsx"},{"name":"Badge","sourcePath":"components/badge/Badge.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"WorkCard","sourcePath":"components/card/WorkCard.jsx"},{"name":"Marquee","sourcePath":"components/marquee/Marquee.jsx"}],"sourceHashes":{"components/accordion/Accordion.jsx":"d814beda6212","components/badge/Badge.jsx":"27fd53ecc119","components/buttons/Button.jsx":"39665657e0d2","components/card/WorkCard.jsx":"2c2b94f41395","components/marquee/Marquee.jsx":"f45be1035794"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ClamyDesignSystem_3c3d9d = window.ClamyDesignSystem_3c3d9d || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/accordion/Accordion.jsx
try { (() => {
const {
  useState
} = React;
/**
 * Accordion item for Process steps or FAQ entries.
 * variant="process" — "STEP · 01" label + title + body + optional image
 * variant="faq"     — question + answer, expandable
 */
function AccordionItem({
  variant = 'process',
  stepLabel,
  title,
  children,
  imageSrc,
  imageAlt = '',
  defaultOpen = false,
  theme = 'dark',
  ...rest
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isDark = theme === 'dark';
  const fgPrimary = isDark ? 'var(--ink)' : 'var(--text)';
  const fgMuted = isDark ? 'var(--ink-muted)' : 'var(--text-muted)';
  const fgFaint = isDark ? 'var(--ink-faint)' : 'var(--text-faint)';
  const ruleColor = isDark ? 'var(--rule)' : 'var(--rule-paper)';
  const wrapStyle = {
    borderTop: `1px solid ${ruleColor}`,
    paddingTop: '28px',
    paddingBottom: open ? '36px' : '28px',
    transition: 'padding var(--dur-base) var(--ease)'
  };

  // ── Process variant ──────────────────────────────────────
  if (variant === 'process') {
    return React.createElement('article', {
      style: wrapStyle,
      ...rest
    }, React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: '24px',
        alignItems: 'start'
      }
    }, React.createElement('span', {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--type-label-size)',
        letterSpacing: 'var(--type-label-track)',
        textTransform: 'uppercase',
        color: fgFaint,
        paddingTop: '4px'
      }
    }, stepLabel), React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: imageSrc ? '1fr 1fr' : '1fr',
        gap: '32px',
        alignItems: 'start'
      }
    }, React.createElement('div', null, React.createElement('h3', {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--type-title-size)',
        fontWeight: 700,
        color: fgPrimary,
        margin: '0 0 12px',
        lineHeight: 1.25
      }
    }, title), React.createElement('div', {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        lineHeight: 1.7,
        color: fgMuted
      }
    }, children)), imageSrc && React.createElement('div', {
      style: {
        overflow: 'hidden',
        aspectRatio: '4/3'
      }
    }, React.createElement('img', {
      src: imageSrc,
      alt: imageAlt,
      loading: 'lazy',
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }
    })))));
  }

  // ── FAQ variant ──────────────────────────────────────────
  return React.createElement('article', {
    style: wrapStyle,
    ...rest
  }, React.createElement('button', {
    onClick: () => setOpen(o => !o),
    style: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '24px',
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)',
      fontWeight: 600,
      color: fgPrimary,
      textAlign: 'left',
      lineHeight: 1.3
    },
    'aria-expanded': open
  }, title, React.createElement('span', {
    style: {
      flexShrink: 0,
      width: 20,
      height: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: `1px solid ${ruleColor}`,
      color: fgMuted,
      fontSize: '1rem',
      lineHeight: 1,
      transition: 'transform var(--dur-base) var(--ease)',
      transform: open ? 'rotate(45deg)' : 'none'
    }
  }, '+')), open && React.createElement('div', {
    style: {
      marginTop: '16px',
      fontFamily: 'var(--font-body)',
      fontSize: '0.95rem',
      lineHeight: 1.7,
      color: fgMuted,
      maxWidth: '680px'
    }
  }, children));
}

/**
 * Wrapper for a group of AccordionItems — handles exclusive open (one at a time).
 */
function Accordion({
  items = [],
  variant = 'process',
  theme = 'dark',
  ...rest
}) {
  const [openIndex, setOpenIndex] = useState(variant === 'process' ? 0 : -1);
  return React.createElement('div', rest, items.map((item, i) => React.createElement(AccordionItem, {
    key: i,
    variant,
    theme,
    stepLabel: item.stepLabel,
    title: item.title,
    imageSrc: item.imageSrc,
    imageAlt: item.imageAlt,
    defaultOpen: i === openIndex,
    onClick: variant === 'faq' ? () => setOpenIndex(openIndex === i ? -1 : i) : undefined
  }, item.body)));
}
Object.assign(__ds_scope, { AccordionItem, Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/accordion/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/badge/Badge.jsx
try { (() => {
/**
 * Badge — stat result pill used in work cards.
 * Displays a bold metric (e.g. "$2M+", "58%") with optional label below.
 *
 * @param {'dark'|'light'} theme — match to containing section
 */
function Badge({
  value,
  label,
  theme = 'light',
  style: extStyle,
  ...rest
}) {
  const isDark = theme === 'dark';
  const wrapStyle = {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '6px',
    ...extStyle
  };
  const pillStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1,
    borderRadius: 'var(--radius)',
    border: `1px solid ${isDark ? 'var(--rule-strong)' : 'var(--rule-paper-strong)'}`,
    background: isDark ? 'oklch(100% 0 0 / 0.04)' : 'oklch(0% 0 0 / 0.03)',
    color: isDark ? 'var(--ink)' : 'var(--text)'
  };
  const labelStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    fontWeight: 400,
    lineHeight: 1.4,
    color: isDark ? 'var(--ink-muted)' : 'var(--text-muted)',
    maxWidth: '160px'
  };
  return React.createElement('div', {
    style: wrapStyle,
    ...rest
  }, React.createElement('span', {
    style: pillStyle
  }, value), label && React.createElement('span', {
    style: labelStyle
  }, label));
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/badge/Badge.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
const {
  useState
} = React;
const ArrowIcon = ({
  size = 11
}) => React.createElement('svg', {
  viewBox: '0 0 12 12',
  width: size,
  height: size,
  fill: 'none',
  'aria-hidden': true,
  style: {
    flexShrink: 0
  }
}, React.createElement('path', {
  d: 'M2 10 L10 2 M4 2 h6 v6',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round'
}));

/**
 * Button — primary CTA, outline, and ghost variants.
 * Sharp corners, Archivo Bold, with optional diagonal arrow.
 *
 * @param {'primary'|'outline'|'ghost'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} arrow
 * @param {string} href — renders as <a> when provided
 */
function Button({
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  children,
  arrow = true,
  disabled = false,
  style: extStyle,
  ...rest
}) {
  const [hovered, setHovered] = useState(false);
  const pad = {
    sm: '8px 18px',
    md: '12px 26px',
    lg: '18px 38px'
  }[size];
  const fsize = {
    sm: '0.82rem',
    md: '0.95rem',
    lg: '1.05rem'
  }[size];
  const gap = size === 'sm' ? 6 : 10;
  const arrowSize = size === 'lg' ? 13 : 10;
  const variantStyles = {
    primary: {
      background: hovered ? 'oklch(87% 0.006 80)' : 'var(--ink)',
      color: 'var(--ground)',
      border: 'none'
    },
    outline: {
      background: 'transparent',
      color: hovered ? 'var(--ink)' : 'var(--ink-muted)',
      border: `1px solid ${hovered ? 'var(--rule-strong)' : 'var(--rule)'}`
    },
    ghost: {
      background: 'transparent',
      color: hovered ? 'var(--ink)' : 'var(--ink-muted)',
      border: 'none',
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
      paddingBottom: '2px',
      borderBottom: `1px solid ${hovered ? 'var(--ink-muted)' : 'transparent'}`
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: `${gap}px`,
    padding: pad,
    fontFamily: 'var(--font-body)',
    fontSize: fsize,
    fontWeight: 700,
    letterSpacing: '0.01em',
    lineHeight: 1,
    textDecoration: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    borderRadius: 0,
    transition: `background ${disabled ? '0s' : 'var(--dur-fast)'} var(--ease),
                 color var(--dur-fast) var(--ease),
                 border-color var(--dur-fast) var(--ease)`,
    userSelect: 'none',
    ...variantStyles[variant],
    ...extStyle
  };
  const Tag = href ? 'a' : 'button';
  return React.createElement(Tag, {
    style: base,
    href: disabled ? undefined : href,
    onClick: disabled ? undefined : onClick,
    disabled: Tag === 'button' ? disabled : undefined,
    onMouseEnter: () => !disabled && setHovered(true),
    onMouseLeave: () => setHovered(false),
    ...rest
  }, children, arrow && React.createElement(ArrowIcon, {
    size: arrowSize
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/card/WorkCard.jsx
try { (() => {
const {
  useState
} = React;
/**
 * WorkCard — full project showcase card.
 * Used in the work/success-stories section (light theme).
 * Image left (65%), info right (35%), separated by a hairline rule at top.
 */
function WorkCard({
  index,
  title,
  description,
  result,
  resultLabel,
  imageSrc,
  imageAlt = '',
  href = '#',
  style: extStyle,
  ...rest
}) {
  const [imgHovered, setImgHovered] = useState(false);
  const cardStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    borderTop: '1px solid var(--rule-paper)',
    paddingTop: '40px',
    paddingBottom: '40px',
    gap: '28px',
    ...extStyle
  };
  const innerStyle = {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1fr',
    gap: '40px',
    alignItems: 'start'
  };
  const mediaStyle = {
    overflow: 'hidden',
    aspectRatio: '16/11',
    display: 'block',
    background: 'var(--paper-deep)'
  };
  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.7s var(--ease)',
    transform: imgHovered ? 'scale(1.03)' : 'scale(1)'
  };
  const infoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingTop: '8px'
  };
  const indexStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--type-label-size)',
    letterSpacing: 'var(--type-label-track)',
    textTransform: 'uppercase',
    color: 'var(--text-faint)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };
  const indexBoxStyle = {
    display: 'inline-block',
    border: '1px solid var(--rule-paper)',
    padding: '2px 6px',
    fontSize: '0.6rem',
    letterSpacing: '0.1em'
  };
  const titleStyle = {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)',
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    color: 'var(--text)',
    margin: 0
  };
  const descStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    lineHeight: 1.65,
    color: 'var(--text-muted)',
    margin: 0
  };
  return React.createElement('article', {
    style: cardStyle,
    ...rest
  }, React.createElement('div', {
    style: innerStyle
  }, React.createElement('a', {
    href,
    style: mediaStyle,
    onMouseEnter: () => setImgHovered(true),
    onMouseLeave: () => setImgHovered(false)
  }, imageSrc && React.createElement('img', {
    src: imageSrc,
    alt: imageAlt,
    loading: 'lazy',
    style: imgStyle
  })), React.createElement('div', {
    style: infoStyle
  }, index && React.createElement('span', {
    style: indexStyle
  }, 'SS ', React.createElement('span', {
    style: {
      fontSize: '0.7em',
      opacity: 0.5
    }
  }, '→'), ' ', React.createElement('span', {
    style: indexBoxStyle
  }, index)), React.createElement('h3', {
    style: titleStyle
  }, title), React.createElement('p', {
    style: descStyle
  }, description), result && React.createElement('div', {
    style: {
      marginTop: '8px'
    }
  }, React.createElement('div', {
    style: {
      display: 'inline-block',
      border: '1px solid var(--rule-paper-strong)',
      padding: '6px 14px',
      fontFamily: 'var(--font-body)',
      fontSize: '1rem',
      fontWeight: 700,
      color: 'var(--text)',
      marginBottom: '8px'
    }
  }, result), resultLabel && React.createElement('p', {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: '0.8rem',
      color: 'var(--text-muted)',
      lineHeight: 1.4,
      margin: 0
    }
  }, resultLabel)))));
}
Object.assign(__ds_scope, { WorkCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/card/WorkCard.jsx", error: String((e && e.message) || e) }); }

// components/marquee/Marquee.jsx
try { (() => {
const {
  useRef
} = React;
/**
 * Marquee — infinite horizontal scrolling text band.
 * Items scroll continuously. Separator character between items.
 */
function Marquee({
  items = [],
  separator = '✳',
  speed = 40,
  theme = 'dark',
  style: extStyle,
  ...rest
}) {
  const isDark = theme === 'dark';
  const fgPrimary = isDark ? 'var(--ink)' : 'var(--text)';
  const fgFaint = isDark ? 'var(--ink-faint)' : 'var(--text-faint)';
  const trackItems = [...items, ...items]; // duplicate for seamless loop

  const outerStyle = {
    overflow: 'hidden',
    display: 'flex',
    width: '100%',
    ...extStyle
  };
  const trackStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    whiteSpace: 'nowrap',
    animation: `marquee-scroll ${speed}s linear infinite`,
    willChange: 'transform'
  };
  const itemStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
    fontWeight: 500,
    color: fgPrimary,
    flexShrink: 0
  };
  const dotStyle = {
    color: fgFaint,
    flexShrink: 0,
    fontSize: '0.7em'
  };
  return React.createElement('div', {
    style: outerStyle,
    ...rest
  }, React.createElement('style', null, `@keyframes marquee-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }`), React.createElement('div', {
    style: trackStyle
  }, trackItems.flatMap((item, i) => [React.createElement('span', {
    key: `item-${i}`,
    style: itemStyle
  }, item), React.createElement('span', {
    key: `dot-${i}`,
    style: dotStyle,
    'aria-hidden': true
  }, separator)])));
}
Object.assign(__ds_scope, { Marquee });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marquee/Marquee.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AccordionItem = __ds_scope.AccordionItem;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.WorkCard = __ds_scope.WorkCard;

__ds_ns.Marquee = __ds_scope.Marquee;

})();
