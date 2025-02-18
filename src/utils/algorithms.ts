export const skipPageNumber = (page: number, limit: number) => {
  if (!page || !limit) return 0
  if (page < 1 || limit < 0) return 0

  return (page - 1) * limit
}
