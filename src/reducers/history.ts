/**
 * A command previously entered or
 * in the process of being crafted.
 */
interface CommandHistoryItem {
  preCursor: string;
  postCursor: string;
}

// Put most recent command at start of history.
// Makes sense if considering 0th item as most recent command.
const commandHistoryReducer = (state: CommandHistoryItem[], action: CommandHistoryItem) => {
  return [action, ...state];
};

enum VisualHistoryItemType {
  Input,
  Output,
  Error,
}

/**
 * An item rendered to the screen.
 * May be displayed differently depending on
 * its type.
 */
interface VisualHistoryItem {
  type: VisualHistoryItemType;
  content: string;
}

// Put most recent item at end of history.
const visualHistoryReducer = (state: VisualHistoryItem[], action: VisualHistoryItem) => {
  return [...state, action];
};

export {
  commandHistoryReducer,
  visualHistoryReducer,
  VisualHistoryItemType,
};
