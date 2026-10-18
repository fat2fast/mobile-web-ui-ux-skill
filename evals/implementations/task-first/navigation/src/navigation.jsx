import React, { useEffect, useRef } from "react";
import { destinations } from "./navigation-data";
export default function Navigation({ role, section, href }) {
  const dialog = useRef(null),
    opener = useRef(null),
    closeReason = useRef(null);
  const allowed = destinations.filter(
    (item) => !item.editorOnly || role === "editor",
  );
  const links = (items) =>
    items.map((item) => (
      <a
        key={item.id}
        href={href("/" + item.id)}
        aria-current={section === item.id ? "page" : undefined}
        onClick={(event) => {
          if (
            dialog.current?.open &&
            event.button === 0 &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey
          ) {
            closeReason.current = "navigation";
            dialog.current.close();
          }
        }}
      >
        {item.label}
      </a>
    ));
  useEffect(() => {
    const mq = matchMedia("(min-width: 960px)");
    const close = () => {
      if (mq.matches && dialog.current?.open) {
        closeReason.current = "resize";
        dialog.current.close();
      }
    };
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);
  return (
    <>
      <nav className="desktop-sidebar" aria-label="Workspace">
        {links(allowed)}
      </nav>
      <nav className="mobile-navigation" aria-label="Mobile workspace">
        {links(
          allowed.filter((item) => ["overview", "tasks"].includes(item.id)),
        )}
        <button
          ref={opener}
          type="button"
          onClick={() => {
            closeReason.current = null;
            dialog.current.showModal();
          }}
        >
          More destinations
        </button>
      </nav>
      <dialog
        ref={dialog}
        aria-labelledby="destinations-heading"
        onClose={() => {
          const reason = closeReason.current;
          closeReason.current = null;
          if (reason === "resize") document.querySelector("main h1")?.focus();
          else if (reason !== "navigation") opener.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) {
            const rect = dialog.current.getBoundingClientRect();
            if (
              event.clientX < rect.left ||
              event.clientX > rect.right ||
              event.clientY < rect.top ||
              event.clientY > rect.bottom
            )
              dialog.current.close();
          }
        }}
      >
        <h2 id="destinations-heading">Workspace destinations</h2>
        <button type="button" onClick={() => dialog.current.close()}>
          Close navigation
        </button>
        <nav aria-label="All destinations">
          {links(
            allowed.filter((item) => !["overview", "tasks"].includes(item.id)),
          )}
        </nav>
      </dialog>
    </>
  );
}
