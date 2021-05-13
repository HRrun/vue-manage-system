export function formatDate(originVal) {
  const dt = new Date(originVal)
  const yyyy = dt.getFullYear()
  const MM = (dt.getMonth() + 1 + '').padStart(2, '0')
  const dd = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`
}