/**
 * A command previously entered or
 * in the process of being crafted.
 */
interface CommandHistoryItem {
  input: string;
}

// Put most recent command at start of history.
// Makes sense if considering 0th item as most recent command.
const commandHistoryReducer = (state: CommandHistoryItem[], action: CommandHistoryItem) => {
  return [action, ...state];
};

enum VisualHistoryActionType {
  Clear,
  PushItem,
}

interface VisualHistoryAction {
  type: VisualHistoryActionType,
  item?: VisualHistoryItem,
}

enum VisualHistoryItemType {
  Input,
  Output,
  Error,
  StartupOutput,
}

/**
 * An item rendered to the screen.
 * May be displayed differently depending on
 * its type.
 */
interface VisualHistoryItem {
  type: VisualHistoryItemType;
  content: string;
  prompt: string | undefined;
}

// Put most recent item at end of history.
const visualHistoryReducer = (state: VisualHistoryItem[], action: VisualHistoryAction) => {
  switch (action.type) {
    case VisualHistoryActionType.Clear:
      return [];
    case VisualHistoryActionType.PushItem:
      if (!action.item) {
        return state;
      }
      return [...state, action.item];
  }
};

export {
  commandHistoryReducer,
  visualHistoryReducer,
  VisualHistoryActionType,
  VisualHistoryItemType,
};
