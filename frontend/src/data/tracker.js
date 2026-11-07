// tracker.js remembers which jobs are on the Application tracker, and in
// which column. Two pages use it:
//   - Discovery: pressing Save adds a job (to the "Saved" column), and
//     pressing it again takes the job off.
//   - Application tracker: shows the jobs, and saves where you drag them.
//
// The list is kept in this browser's storage (localStorage), so it's still
// there after a refresh or after going to another page. It looks like:
//   [ { id: 1, stage: "saved" }, { id: 3, stage: "submitted" } ]
// "id" matches an opportunity in opportunities.js, and "stage" is the column:
// "saved", "preparing", or "submitted".
//
// Later, this list would be saved by the backend for each account instead.
//
// Every read and write is inside try/catch: the browser's storage can be
// turned off (for example in a private window). Then the tracker just starts
// empty instead of the page breaking.

// The name this list is saved under in the browser's storage
const storageName = "scoutsearch-applications";

// Gives back the whole list (or an empty list if there's nothing saved yet)
export function loadTracker() {
  try {
    const list = JSON.parse(localStorage.getItem(storageName) || "[]");
    // Array.isArray checks it really is a list, in case something else got saved there
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Saves the whole list
export function saveTracker(list) {
  try {
    localStorage.setItem(storageName, JSON.stringify(list));
  } catch {
    // Storage is turned off. Nothing to do: the tracker just won't remember.
  }
}

// True if this job is on the tracker (in any column).
// .some() is true if at least one item in the list passes the test.
export function isOnTracker(id) {
  return loadTracker().some((item) => item.id === id);
}

// Adds a job to the "Saved" column (if it isn't on the tracker already)
export function addToTracker(id) {
  const list = loadTracker();
  if (!list.some((item) => item.id === id)) {
    // [...list, newItem] makes a new list: everything already there, plus the new one
    saveTracker([...list, { id: id, stage: "saved" }]);
  }
}

// Takes a job off the tracker, whichever column it's in.
// .filter() keeps every item except this job.
export function removeFromTracker(id) {
  saveTracker(loadTracker().filter((item) => item.id !== id));
}
