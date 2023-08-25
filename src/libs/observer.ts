import { useCallback, useEffect, useRef } from "react";

export default function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
        }
      });
    }, options);
  }, [callback]);

  const observe = useCallback((element: Element) => {
    console.log("observe", element);
    observer.current?.observe(element);
  }, []);

  const unobserve = useCallback((element: Element) => {
    console.log("unobserve", element);
    observer.current?.unobserve(element);
  }, []);

  return [observe, unobserve];
}
