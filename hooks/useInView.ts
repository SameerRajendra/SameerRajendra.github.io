import { useEffect, useRef, useState, RefObject } from 'react';

interface UseInViewOptions {
    threshold?: number;
    rootMargin?: string;
    once?: boolean;
}

function prefersReducedMotion(): boolean {
    return typeof window !== 'undefined' && !!window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
}

// Thin wrapper around IntersectionObserver for scroll-triggered reveals.
// Under prefers-reduced-motion, or when IntersectionObserver is unavailable,
// it returns [ref, true] immediately and never attaches an observer — the
// caller's CSS is responsible for rendering the final state in that case.
export function useInView<T extends HTMLElement>(
    options: UseInViewOptions = {}
): [RefObject<T>, boolean] {
    const { threshold = 0.15, rootMargin = '0px 0px -10% 0px', once = true } = options;
    const ref = useRef<T>(null);
    const [isInView, setIsInView] = useState<boolean>(() => prefersReducedMotion());

    useEffect(() => {
        if (prefersReducedMotion()) {
            setIsInView(true);
            return;
        }

        const node = ref.current;
        if (!node || typeof IntersectionObserver === 'undefined') {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        if (once) {
                            observer.unobserve(entry.target);
                        }
                    } else if (!once) {
                        setIsInView(false);
                    }
                });
            },
            { threshold, rootMargin }
        );

        observer.observe(node);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threshold, rootMargin, once]);

    return [ref, isInView];
}
