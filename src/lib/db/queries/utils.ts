export function firstOrUndefined<T>(items: T[]) {
  if (items.length === 0) {
    return;
  }
  return items[0];
}

export function allOrUndefined<T>(items: T[]) {
  if (items.length === 0) {
    return;
  }

  return items;
}