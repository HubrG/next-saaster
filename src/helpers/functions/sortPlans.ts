
export const sortByActiveAndDate = (a: any, b: any) => {
  if (a.active && !b.active) {
    return -1;
  }
  if (!a.active && b.active) {
    return 1;
  }
  const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  return dateA - dateB;
};

// Sort par "position"
export const sortByPosition = (a: any, b: any) => {
 
    return a.position - b.position;
 
  
};
