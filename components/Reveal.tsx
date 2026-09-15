import React from 'react';
import { useInView } from '../hooks/useInView';

type RevealVariant = 'up' | 'lift' | 'scale';

interface RevealProps extends Omit<React.HTMLAttributes<HTMLElement>, 'className'> {
    as?: keyof JSX.IntrinsicElements;
    variant?: RevealVariant;
    delay?: number;
    stagger?: boolean;
    className?: string;
    children?: React.ReactNode;
}

const VARIANT_CLASS: Record<RevealVariant, string> = {
    up: '',
    lift: 'reveal--lift',
    scale: 'reveal--scale',
};

// Generic scroll-reveal wrapper consuming the .reveal family in
// styles/motion.css. Toggles .is-visible via useInView; the CSS itself
// (gated behind @media (scripting: enabled)) owns the actual hidden/visible
// styling, so this component only ever manages class names + an optional
// delay — it never sets opacity/transform directly.
const Reveal: React.FC<RevealProps> = ({
    as = 'div',
    variant = 'up',
    delay = 0,
    stagger = false,
    className = '',
    style,
    children,
    ...rest
}) => {
    const [ref, isVisible] = useInView<HTMLElement>();
    const Tag = as as any;

    const classes = ['reveal', VARIANT_CLASS[variant], stagger ? 'stagger' : '', isVisible ? 'is-visible' : '', className]
        .filter(Boolean)
        .join(' ');

    const mergedStyle: React.CSSProperties | undefined = delay
        ? { ...(style as React.CSSProperties), transitionDelay: `${delay}ms` }
        : style;

    return (
        <Tag ref={ref} className={classes} style={mergedStyle} {...rest}>
            {children}
        </Tag>
    );
};

export default Reveal;
