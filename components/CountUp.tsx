import React, { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';

interface CountUpProps {
    value: string;
    duration?: number;
    className?: string;
}

interface ParsedValue {
    prefix: string;
    numStr: string;
    suffix: string;
}

function prefersReducedMotion(): boolean {
    return typeof window !== 'undefined' && !!window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
}

// Finds the first numeric run in the string (optionally signed, with
// thousands separators and/or a decimal point) and splits around it.
// "4,699" -> ["", "4,699", ""]
// "62 of 63" -> ["", "62", " of 63"]
// "1.35 to 0.14 ms" -> ["", "1.35", " to 0.14 ms"]
// "+0.24%" -> ["", "+0.24", "%"]
// "about $1-5/month" -> ["about $", "1", "-5/month"]
function parseLeadingNumber(value: string): ParsedValue | null {
    const match = value.match(/^(\D*?)([+-]?[\d,]+(?:\.\d+)?)([\s\S]*)$/);
    if (!match) return null;
    return { prefix: match[1], numStr: match[2], suffix: match[3] };
}

function formatFrame(current: number, decimals: number, grouped: boolean, signed: boolean): string {
    const abs = Math.abs(current);
    let body = decimals > 0 ? abs.toFixed(decimals) : String(Math.round(abs));
    if (grouped) {
        const [intPart, fracPart] = body.split('.');
        const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        body = fracPart ? `${withCommas}.${fracPart}` : withCommas;
    }
    const sign = signed ? '+' : current < 0 ? '-' : '';
    return sign + body;
}

// Renders the exact final string in the DOM at all times (for prerender,
// no-JS, reduced motion, and screen readers) and — only when JS is present,
// motion is not reduced, and the element has scrolled into view — mounts a
// short-lived aria-hidden overlay that counts up to that same value. Never
// reformats, rounds, or otherwise alters the source string.
const CountUp: React.FC<CountUpProps> = ({ value, duration = 900, className = '' }) => {
    const [ref, isVisible] = useInView<HTMLSpanElement>({ threshold: 0.4 });
    const [animating, setAnimating] = useState(false);
    const [display, setDisplay] = useState(value);
    const startedRef = useRef(false);

    useEffect(() => {
        if (!isVisible || startedRef.current) return;
        if (prefersReducedMotion()) return;

        const parsed = parseLeadingNumber(value);
        if (!parsed) return;

        const target = parseFloat(parsed.numStr.replace(/,/g, ''));
        if (Number.isNaN(target)) return;

        startedRef.current = true;

        const decimals = (parsed.numStr.split('.')[1] || '').length;
        const grouped = parsed.numStr.replace(/^[+-]/, '').includes(',');
        const signed = parsed.numStr.startsWith('+');

        setAnimating(true);
        const start = performance.now();
        let raf = 0;

        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const currentValue = target * eased;
            setDisplay(`${parsed.prefix}${formatFrame(currentValue, decimals, grouped, signed)}${parsed.suffix}`);
            if (t < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                setDisplay(value);
                setAnimating(false);
            }
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [isVisible, value, duration]);

    return (
        <span ref={ref} className={`countup${animating ? ' is-animating' : ''}${className ? ` ${className}` : ''}`}>
            <span className="countup-final">{value}</span>
            {animating && (
                <span className="countup-anim" aria-hidden="true">
                    {display}
                </span>
            )}
        </span>
    );
};

export default CountUp;
