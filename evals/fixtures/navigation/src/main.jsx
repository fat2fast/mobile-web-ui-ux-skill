import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { destinations, initialTasks, statuses } from "./navigation-data";
import Navigation from "./navigation";
import "./style.css";

function App() {
  const [url, setUrl] = useState(() => new URL(location.href));
  const [tasks, setTasks] = useState(() =>
    initialTasks.map((task) => ({ ...task })),
  );
  const heading = useRef(null);
  const role = url.searchParams.get("role") === "viewer" ? "viewer" : "editor";
  const parts = url.pathname.split("/").filter(Boolean);
  const section = parts[0] || "overview";
  const destination = destinations.find((item) => item.id === section);
  const task = tasks.find((item) => item.id === parts[1]);
  const editing = parts[2] === "edit";
  const valid =
    destination &&
    (section === "tasks"
      ? parts.length === 1 ||
        (task && (parts.length === 2 || (parts.length === 3 && editing)))
      : parts.length === 1 || !parts.length);
  const restricted =
    valid && role !== "editor" && (destination.editorOnly || editing);
  useEffect(() => {
    const pop = () => setUrl(new URL(location.href));
    const click = (event) => {
      const link = event.target.closest("a");
      if (
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const next = new URL(link.href);
      if (next.origin !== location.origin) return;
      event.preventDefault();
      history.pushState(null, "", next);
      pop();
    };
    window.addEventListener("popstate", pop);
    document.addEventListener("click", click);
    return () => {
      window.removeEventListener("popstate", pop);
      document.removeEventListener("click", click);
    };
  }, []);
  useEffect(() => {
    heading.current?.focus();
  }, [url.pathname, role]);
  const href = (pathname) => {
    const next = new URL(pathname, location.origin);
    next.searchParams.set("role", role);
    return next.pathname + next.search;
  };
  const go = (pathname, replace = false) => {
    history[replace ? "replaceState" : "pushState"](null, "", href(pathname));
    setUrl(new URL(location.href));
  };
  const query = url.searchParams.get("q") || "";
  const title = !valid
    ? "Not found"
    : restricted
      ? "Access restricted"
      : task
        ? editing
          ? "Edit task"
          : task.title
        : destination.label;
  return (
    <div className="workspace">
      <header className="workspace-header">
        <strong>Fieldwork workspace</strong>
        <label>
          Evaluation role{" "}
          <select
            value={role}
            onChange={(event) => {
              const next = new URL(location.href);
              next.searchParams.set("role", event.target.value);
              history.replaceState(null, "", next);
              setUrl(next);
            }}
          >
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
      </header>
      <Navigation role={role} section={section} href={href} />
      <main id="main">
        <h1 tabIndex="-1" ref={heading}>
          {title}
        </h1>
        {!valid ? (
          <p>
            That route is unavailable. <a href={href("/tasks")}>Open tasks</a>
          </p>
        ) : restricted ? (
          <section aria-label="Restricted destination">
            <p>Editor capability is required in this local evaluation.</p>
            <a href={href("/tasks")}>Return to tasks</a>
          </section>
        ) : section === "tasks" ? (
          task ? (
            editing ? (
              <Editor
                key={task.id + url.pathname}
                task={task}
                onCancel={() => {
                  if (history.state?.fromDetail) history.back();
                  else go("/tasks/" + task.id, true);
                }}
                onSave={(updated) => {
                  setTasks((current) =>
                    current.map((item) =>
                      item.id === updated.id ? updated : item,
                    ),
                  );
                  if (history.state?.fromDetail) history.back();
                  else go("/tasks/" + task.id, true);
                }}
              />
            ) : (
              <section aria-label="Task details">
                <p>Task ID: {task.id}</p>
                <p>Status: {task.status}</p>
                {role === "editor" && (
                  <a
                    className="button"
                    href={href("/tasks/" + task.id + "/edit")}
                    onClick={(event) => {
                      if (
                        event.button !== 0 ||
                        event.metaKey ||
                        event.ctrlKey ||
                        event.shiftKey ||
                        event.altKey
                      )
                        return;
                      event.preventDefault();
                      history.pushState(
                        { fromDetail: true },
                        "",
                        href("/tasks/" + task.id + "/edit"),
                      );
                      setUrl(new URL(location.href));
                    }}
                  >
                    Edit task
                  </a>
                )}
                <p>
                  <a href={href("/tasks")}>All tasks</a>
                </p>
              </section>
            )
          ) : (
            <section aria-label="Task list">
              <label>
                Search tasks{" "}
                <input
                  value={query}
                  onChange={(event) => {
                    const next = new URL(location.href);
                    event.target.value
                      ? next.searchParams.set("q", event.target.value)
                      : next.searchParams.delete("q");
                    history.replaceState(null, "", next);
                    setUrl(next);
                  }}
                />
              </label>
              <p role="status">
                {
                  tasks.filter((item) =>
                    (item.id + " " + item.title)
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  ).length
                }{" "}
                tasks shown
              </p>
              <ul className="tasks">
                {tasks
                  .filter((item) =>
                    (item.id + " " + item.title)
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .map((item) => (
                    <li key={item.id}>
                      <a href={href("/tasks/" + item.id)}>{item.title}</a>
                      <p>
                        {item.id} · {item.status}
                      </p>
                    </li>
                  ))}
              </ul>
            </section>
          )
        ) : (
          <section aria-label={destination.label + " context"}>
            <p>{destination.purpose}</p>
            <a className="button" href={href("/tasks")}>
              Open tasks
            </a>
          </section>
        )}
      </main>
      <footer>Local evaluation · Changes reset on reload</footer>
    </div>
  );
}
function Editor({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title),
    [status, setStatus] = useState(task.status),
    [error, setError] = useState("");
  const input = useRef(null);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!title.trim()) {
          setError("Enter a task title.");
          input.current.focus();
          return;
        }
        onSave({ ...task, title, status });
      }}
      noValidate
    >
      <p>{task.id} · Local in-memory edit</p>
      <label>
        Task title{" "}
        <input
          ref={input}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "title-error" : undefined}
        />
      </label>
      {error && (
        <p id="title-error" role="alert">
          {error}
        </p>
      )}
      <label>
        Task status{" "}
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {statuses.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <div className="actions">
        <button type="submit">Save task</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
createRoot(document.getElementById("root")).render(<App />);
