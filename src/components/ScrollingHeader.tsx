"use client"

import Link from "next/link"
import { FC, MutableRefObject, useEffect, useRef, useState } from "react";


export const Header = () => {
  const [multiplier, referenceElementRef] = useScrollSize();

  return (
    <>
    <div className="h-[20vh] w-[1px] top-0 absolute opacity-0" ref={referenceElementRef} aria-hidden="true"></div>

    <header className="flex items-stretch sticky top-0 py-4 px-2 border-b-2 border-b-slate-800 dark:border-b-slate-50 w-full">
      <ScrollableLogo multiplier={multiplier}/>
      <nav className="flex basis-full justify-self-end justify-end">
        <ul className="flex gap-2">
          <li><Link href="/" className="pr-2 hover:underline underline-offset-2 border-r-slate-800 dark:border-r-slate-50 border-r-2">Home</Link></li>
          <li><Link href="/" className="pr-2 hover:underline underline-offset-2 border-r-slate-800 dark:border-r-slate-50 border-r-2">Other Page</Link></li>
          <li><Link href="/" className="pr-2 hover:underline underline-offset-2 ">Another Page</Link></li>
        </ul>
      </nav>
    </header>
    </>
  )
}

const getThresholds = (stepCount: number) => {
  const step = 1 / stepCount;
  let i = 0 - step;
  return Array.from(Array(stepCount), () => +(i += step).toFixed(2))
}

// credit: https://spicyyoghurt.com/tools/easing-functions
function easeInOutCubic(t: number, b: number, c: number, d: number) {
  return c * (t /= d) * t * t + b;
}

type UseScrollSize = () => [number, MutableRefObject<HTMLDivElement | null>]

const useScrollSize: UseScrollSize = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [multiplier, setMultiplier] = useState<number>(0);


  const [prefersReduceMotion, setPrefersReduceMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window?.matchMedia("(prefers-reduced-motion: reduce)")?.matches
    } else {
      return false;
    }
  });

  

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => {
      setPrefersReduceMotion(event.matches);
    }
    const reduceMotionQuery = window?.matchMedia("(prefers-reduced-motion: reduce)");

    reduceMotionQuery.addEventListener("change", listener);

    return () => {
      reduceMotionQuery?.removeEventListener("change", listener);
    }
  }, [setPrefersReduceMotion]);

  const handler: IntersectionObserverCallback = ([entry]) => {
    setMultiplier(easeInOutCubic(entry.intersectionRatio, 0, 1, 1));
  }

  useEffect(() => {
    let observer: IntersectionObserver;
    if (!prefersReduceMotion) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: getThresholds(5000),
      }

      observer = new IntersectionObserver(handler, options);

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
    }

    const unobserveRef = containerRef.current;

    return () => {
      if (unobserveRef) {
        observer?.unobserve(unobserveRef);
      }
    }
  }, [containerRef, prefersReduceMotion]);

  return [multiplier, containerRef];
}

const INITIAL_SIZE = 482

const START_SCALE = 3
const END_SCALE = 1
const START_TRANSFORM = 3

const computeStyle = (multiplier: number) => ({
  "--endScale": END_SCALE,
  "--startScale": START_SCALE,

  "--startTransformX": `calc((100vw - (${INITIAL_SIZE}px)) / 2)`,
  "--startTransformY": '10vh',
  "--endTransformX": '0px',
  "--endTransformY": '0px',

  "--diffX": 'calc(var(--startTransformX) - var(--endTransformX))',
  "--diffY":  'calc(var(--startTransformY) - var(--endTransformY))',
  "--currentTransformX": `calc(var(--diffX) * ${multiplier})`,
  "--currentTransformY": `calc(var(--diffX) * ${multiplier})`,
  "transform": "translate3d(var(--currentTransformX), var(--currentTransformY), 0px)"
})

export const ScrollableLogo: FC<{ multiplier: number }> = ({ multiplier }) => {
  return (
    <>
      <h1 className="text-5xl absolute top-0" style={computeStyle(1 - multiplier)}>Scrolling Header Demo!</h1>
    </>
  )
}