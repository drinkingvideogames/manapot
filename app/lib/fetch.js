import fetchPonyfill from 'fetch-ponyfill'

let fetch = typeof window === 'object' && window.fetch

if (!(typeof window === 'object' && window.fetch)) {
  let ponyfill = fetchPonyfill()
  fetch = ponyfill.fetch
}

export default fetch
