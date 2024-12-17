import { useEffect } from "react";
import Router from "next/router";

function saveScrollPos(url) {
  const scrollPos = { x: window.scrollX || 0, y: window.scrollY || 0 };
  try {
    sessionStorage.setItem(url, JSON.stringify(scrollPos));
  } catch (error) {
    console.warn("SessionStorage is not supported in this browser", error);
  }
}

function restoreScrollPos(url) {
  let scrollPos = null;
  try {
    scrollPos = JSON.parse(sessionStorage.getItem(url));
  } catch (error) {
    console.warn("Failed to retrieve scroll position", error);
  }

  if (scrollPos) {
    // Safari fallback using requestAnimationFrame
    requestAnimationFrame(() => {
      if ("scrollTo" in window) {
        window.scrollTo({
          top: scrollPos.y,
          left: scrollPos.x,
          behavior: "instant",
        });
      } else {
        window.scroll(scrollPos.x, scrollPos.y);
      }
    });
  }
}

export default function useScrollRestoration(router, shouldSkipRestore) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let shouldScrollRestore = !shouldSkipRestore;

      // Fallback for Safari where scrollRestoration may not work
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }

      const onBeforeUnload = (event) => {
        if (!shouldSkipRestore) saveScrollPos(router.asPath);
        delete event.returnValue;
      };

      const onRouteChangeStart = () => {
        if (!shouldSkipRestore) saveScrollPos(router.asPath);
      };

      const onRouteChangeComplete = (url) => {
        if (shouldScrollRestore && !shouldSkipRestore) {
          shouldScrollRestore = false;
          restoreScrollPos(url);
        }
      };

      window.addEventListener("beforeunload", onBeforeUnload);
      Router.events.on("routeChangeStart", onRouteChangeStart);
      Router.events.on("routeChangeComplete", onRouteChangeComplete);
      Router.beforePopState(() => {
        shouldScrollRestore = true;
        return true;
      });

      if (!shouldSkipRestore) restoreScrollPos(router.asPath);

      return () => {
        window.removeEventListener("beforeunload", onBeforeUnload);
        Router.events.off("routeChangeStart", onRouteChangeStart);
        Router.events.off("routeChangeComplete", onRouteChangeComplete);
        Router.beforePopState(() => true);
      };
    }
  }, [router, shouldSkipRestore]);
}
