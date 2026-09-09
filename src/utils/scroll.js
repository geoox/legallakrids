export const scrollInstantlyTo = (top) => {
  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, top);
  document.documentElement.style.scrollBehavior = previousScrollBehavior;
};
