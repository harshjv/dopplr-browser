const request = require('request')

const { CLOUDFLARE_ZONE, CLOUDFLARE_EMAIL, CLOUDFLARE_API_KEY } = process.env

if (!CLOUDFLARE_ZONE || !CLOUDFLARE_EMAIL || !CLOUDFLARE_API_KEY) throw new Error('Invalid CloudFlare configuration')

request({
  method: 'DELETE',
  uri: `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE}/purge_cache`,
  headers: {
    'X-Auth-Email': CLOUDFLARE_EMAIL,
    'X-Auth-Key': CLOUDFLARE_API_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ 'purge_everything': true })
}, (error, response, body) => {
  if (error) console.error(error)

  try {
    const json = JSON.parse(body)

    if (json.success) console.log('Sucessfully purged CloudFlare cache')
    else console.error(json)
  } catch (e) {
    console.error(e)
  }
})
