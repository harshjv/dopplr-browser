module.exports.getUsername = (text) => {
  const a = text.match(/@\w+/)

  if (a) return a[0].substring(1)
  else return null
}

module.exports.isMeDomain = (host) => {
  return host.endsWith('.me') || host.endsWith('me.test:5000')
}

module.exports.getUsernameFromHost = (host) => {
  const split = host.split('.')

  if (split.length === 3 && split[0] !== 'www') {
    const username = split[0]

    return username
  } else {
    return false
  }
}
