# Redux Toolkit — pattern reference

Use this for Redux-enabled React Meta sidebars (notes/state examples) and any custom React Meta app where the user asks for `@reduxjs/toolkit`, Redux state management, `createSlice`, or `<Provider>` wrapping.

## Install

```bash
npm install @reduxjs/toolkit react-redux
```

`package.json`:

```json
{
  "dependencies": {
    "react": "~18.2.0",
    "react-dom": "~18.2.0",
    "@freshworks/crayons": "~4.6.0",
    "@reduxjs/toolkit": "~2.2.0",
    "react-redux": "~9.1.0"
  }
}
```

## Folder layout

```
app/
├── ticket_sidebar.html
├── components/
│   ├── TicketSidebarMain.jsx     # entry: bootstrap + Provider
│   ├── TicketSidebarApp.jsx      # top-level UI
│   ├── NoteList.jsx              # selectors + per-note rendering
│   ├── PinnedNotes.jsx           # filtered view
│   └── AddNoteForm.jsx           # dispatch addNote
├── store/
│   ├── store.js                  # configureStore
│   └── notesSlice.js             # createSlice + reducers
└── styles/
    └── style.css
```

Keep slices small and feature-scoped. One slice per concept (notes, ui, etc.); this notes example needs only `notesSlice`.

## The slice (`app/store/notesSlice.js`)

```js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 'n1',
      text: 'Customer wants migration window before Friday.',
      author: 'Alex',
      timestamp: '2026-05-04T09:30:00Z',
      pinned: true,
    },
    {
      id: 'n2',
      text: 'Awaiting logs from EU tenant — sent reminder.',
      author: 'Pat',
      timestamp: '2026-05-04T11:05:00Z',
      pinned: false,
    },
    {
      id: 'n3',
      text: 'Engineering ticket linked: ENG-3422.',
      author: 'Sam',
      timestamp: '2026-05-04T15:20:00Z',
      pinned: false,
    },
  ],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare(text, author = 'Current agent') {
        return {
          payload: {
            id: `n${Date.now()}`,
            text,
            author,
            timestamp: new Date().toISOString(),
            pinned: false,
          },
        };
      },
    },
    removeNote(state, action) {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    togglePin(state, action) {
      const note = state.items.find((n) => n.id === action.payload.id);
      if (note) {
        note.pinned = action.payload.pinned ?? !note.pinned;
      }
    },
  },
});

export const { addNote, removeNote, togglePin } = notesSlice.actions;

export const selectAllNotes = (state) => state.notes.items;
export const selectPinnedNotes = (state) => state.notes.items.filter((n) => n.pinned);
export const selectNoteCounts = (state) => ({
  total: state.notes.items.length,
  pinned: state.notes.items.filter((n) => n.pinned).length,
});

export default notesSlice.reducer;
```

Notes:

- Redux Toolkit uses Immer under the hood, so the "mutating" operations inside reducers are safe.
- `prepare` callbacks let `addNote('text')` create the full payload without forcing every dispatch site to build it.
- Selectors live next to the slice for easy reuse across components.

## The store (`app/store/store.js`)

```js
import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notesSlice';

export const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});
```

`configureStore` is a thin wrapper around `createStore` that wires DevTools and good defaults. Do **not** use the legacy `createStore`.

## Wrap the app in `<Provider>`

`<Provider>` must be **inside** the `window.app.initialized()` callback, so the client is available to children that need it, but it must be **above** every component that calls `useSelector` / `useDispatch`.

`app/components/TicketSidebarMain.jsx`:

```jsx
import React, { useState, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { defineCustomElements } from '@freshworks/crayons/loader';
import '@freshworks/crayons/css/crayons-min.css';
import { store } from '../store/store';
import TicketSidebarApp from './TicketSidebarApp';
import '../styles/style.css';

defineCustomElements();

const TicketSidebarMain = () => {
  const [child, setChild] = useState(<p>Loading…</p>);
  useLayoutEffect(() => {
    window.app.initialized().then((client) => {
      window.client = client;
      setChild(
        <Provider store={store}>
          <TicketSidebarApp client={client} />
        </Provider>
      );
    });
  }, []);
  return <div>{child}</div>;
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TicketSidebarMain />
  </React.StrictMode>
);
```

## Components use `useSelector` and `useDispatch`

`app/components/TicketSidebarApp.jsx`:

```jsx
import { useSelector } from 'react-redux';
import { selectNoteCounts } from '../store/notesSlice';
import PinnedNotes from './PinnedNotes';
import NoteList from './NoteList';
import AddNoteForm from './AddNoteForm';

const TicketSidebarApp = () => {
  const counts = useSelector(selectNoteCounts);

  return (
    <div className="notes-shell">
      <header className="notes-header">
        <h2>Agent notes</h2>
        <span className="badge">
          {counts.total} total · {counts.pinned} pinned
        </span>
      </header>

      <PinnedNotes />
      <NoteList />
      <AddNoteForm />
    </div>
  );
};

export default TicketSidebarApp;
```

`app/components/PinnedNotes.jsx`:

```jsx
import { useSelector } from 'react-redux';
import { selectPinnedNotes } from '../store/notesSlice';
import NoteRow from './NoteRow';

const PinnedNotes = () => {
  const pinned = useSelector(selectPinnedNotes);
  if (pinned.length === 0) return null;

  return (
    <section className="pinned-section">
      <h3>Pinned</h3>
      {pinned.map((note) => <NoteRow key={note.id} note={note} />)}
    </section>
  );
};

export default PinnedNotes;
```

`app/components/NoteList.jsx`:

```jsx
import { useSelector } from 'react-redux';
import { selectAllNotes } from '../store/notesSlice';
import NoteRow from './NoteRow';

const NoteList = () => {
  const notes = useSelector(selectAllNotes);

  return (
    <section className="notes-section">
      <h3>All notes</h3>
      {notes.length === 0 && <p className="muted">No notes yet.</p>}
      {notes.map((note) => <NoteRow key={note.id} note={note} />)}
    </section>
  );
};

export default NoteList;
```

`app/components/NoteRow.jsx`:

```jsx
import { useDispatch } from 'react-redux';
import { FwButton, FwToggle } from '@freshworks/crayons/react';
import { removeNote, togglePin } from '../store/notesSlice';

const NoteRow = ({ note }) => {
  const dispatch = useDispatch();
  return (
    <article className="note-row">
      <div className="note-body">
        <p>{note.text}</p>
        <small>{note.author} · {new Date(note.timestamp).toLocaleString()}</small>
      </div>
      <div className="note-actions">
        <FwToggle
          checked={note.pinned}
          onFwChange={(e) => dispatch(togglePin({ id: note.id, pinned: e.detail.checked }))}
        />
        <FwButton color="danger" size="small" onFwClick={() => dispatch(removeNote(note.id))}>
          Delete
        </FwButton>
      </div>
    </article>
  );
};

export default NoteRow;
```

`app/components/AddNoteForm.jsx`:

```jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FwButton, FwTextarea } from '@freshworks/crayons/react';
import { addNote } from '../store/notesSlice';

const AddNoteForm = () => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();

  function submit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch(addNote(trimmed));
    setText('');
  }

  return (
    <section className="add-note">
      <FwTextarea
        label="Add a note"
        value={text}
        rows={3}
        onFwInput={(e) => setText(e.detail.value)}
      />
      <FwButton color="primary" onFwClick={submit} disabled={!text.trim()}>
        Add note
      </FwButton>
    </section>
  );
};

export default AddNoteForm;
```

---

## Sidebar Redux manifest example

```json
{
  "platform-version": "3.0",
  "app": { "tracking_id": "", "start_time": "" },
  "modules": {
    "support_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "ticket_sidebar.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  },
  "metaConfig": { "framework": "react" },
  "scripts": { "fdk-unit-test": "vitest run --coverage" },
  "engines": { "node": "24.11.0", "fdk": "10.0.0" }
}
```

No `requests`/`functions`/`events` blocks — this is a frontend-only Redux example.

---

## Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Could not find react-redux context` | Component above `<Provider>` calls `useSelector` | Move `<Provider>` to wrap the **entire** rendered tree |
| `state.notes.items` is `undefined` | Reducer key in `configureStore` doesn't match selector path | Keep both names aligned (`reducer: { notes: notesReducer }` ↔ `state.notes.items`) |
| Mutations crash | Plain Redux instead of Toolkit | Always use `createSlice` so Immer handles drafts |
| Pin toggle doesn't update UI | Selector returns the same array reference | Toolkit returns new arrays via Immer; if you wrote a manual reducer, return a new array (`state.items.map(...)`) |
| Dispatch from outside a component | Tried `store.dispatch` in a render-time hook | Use `useDispatch()`; only use `store.dispatch` in non-React modules |
| `addNote` payload has no id | Forgot the `prepare` callback or built the payload incorrectly | Use the slice's `prepare` to generate `id` and `timestamp` |
