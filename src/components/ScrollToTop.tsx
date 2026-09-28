import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LENIS_SCROLL_TO_TOP_EVENT } from "../hooks/useLenis";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.dispatchEvent(new Event(LENIS_SCROLL_TO_TOP_EVENT));
  }, [pathname]);

  return null;
}