enum HistoryItemType {
  Input,
  Output,
  Error,
}

interface HistoryItem {
  type: HistoryItemType;
  content: string;
}

const historyReducer = (state: HistoryItem[], action: HistoryItem) => {
  return [...state, action];
};

export { historyReducer, HistoryItemType }
