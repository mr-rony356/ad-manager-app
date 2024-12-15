import { useEffect } from "react";
import Router from "next/router";

function saveScrollPos(url) {
  const scrollPos = { x: window.scrollX, y: window.scrollY };
  sessionStorage.setItem(`scroll-${url}`, JSON.stringify(scrollPos));
}

function restoreScrollPos(url) {
  const scrollPos = JSON.parse(
    sessionStorage.getItem(`scroll-${url}`) || "null",
  );
  if (scrollPos) {
    window.scrollTo(scrollPos.x, scrollPos.y);
  }
}

export default function useScrollRestoration(router, shouldSkipRestore) {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";

      const handleBeforeUnload = () => {
        saveScrollPos(router.asPath);
      };

      const handleRouteChangeStart = () => {
        saveScrollPos(router.asPath);
      };

      const handleRouteChangeComplete = (url) => {
        if (!shouldSkipRestore) {
          restoreScrollPos(url);
        }
      };

      // Add event listeners
      window.addEventListener("beforeunload", handleBeforeUnload);
      router.events.on("routeChangeStart", handleRouteChangeStart);
      router.events.on("routeChangeComplete", handleRouteChangeComplete);

      // Restore scroll position on initial load
      if (!shouldSkipRestore) {
        restoreScrollPos(router.asPath);
      }

      // Cleanup function
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        router.events.off("routeChangeStart", handleRouteChangeStart);
        router.events.off("routeChangeComplete", handleRouteChangeComplete);
      };
    }
  }, [router, shouldSkipRestore]);
}
