export const formatArticleDate = (date) => new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
}).format(new Date(`${date}T00:00:00`));
