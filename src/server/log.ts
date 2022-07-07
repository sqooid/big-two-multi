export function log(message: string) {
  const date = new Date()
  console.log(
    `[${date.getFullYear()}-${date
      .getMonth()
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
      .getHours()
      .toString()
      .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
      .getSeconds()
      .toString()
      .padStart(2, '0')}.${date.getMilliseconds().toString().padEnd(3, '0')}]`,
    message,
  )
}
