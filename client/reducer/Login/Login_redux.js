export default function (state = 3, action) {
  const count = state
  switch (action.type) {
    case 'increasec':
      return count + 1
    default:
      return state
  }
}
