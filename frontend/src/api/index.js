import axios from 'axios'

axios.defaults.baseURL = process.env.API_URL

// maintains global cache
const store = {
  crawls: null,
  results: null,
  totalResults: null,
  languages: null,
  countries: null,
}

export async function getCrawls (cache = false) {
  if (store.crawls === null || !cache) {
    const res = await axios.get('/crawls')
    store.crawls = res.data
  }

  return store.crawls
}

export async function addCrawl (crawl) {
  const res = await axios.put('/crawls', crawl)
  return res.data
}

export async function stopCrawl (crawl) {
  const res = await axios.delete(`/crawls/${crawl.id}`)
  return res.data
}

export async function getResults (params, cache = false) {
  if (store.results === null || !cache) {
    const res = await axios.get('/results', { params })
    store.results = res.data
  }

  return store.results
}

export async function getTotalResults (cache = false) {
  if (store.totalResults === null || !cache) {
    const res = await axios.get('/results/counts')
    store.totalResults = res.data.count
  }

  return store.totalResults
}

export async function classifyResults (urls, label) {
  const res = await axios.post('/results/classify', { urls, label })
  return res.data.updated
}

export async function exportResults (parameters) {
  const params = Object.assign({
    size: 10000,
    format: 'csv',
    download: true
  }, parameters)

  if (params.download) {
    const { download, format, size, query, crawls, onlyCrawlLanguages } = params

    let paramString = `size=${size}&format=${format}&download=${download}&query=${query}&onlyCrawlLanguages=${onlyCrawlLanguages}`
    if (crawls && crawls.length) {
      paramString += `&crawls[]=${crawls}`
    }

    triggerDownload(`${axios.defaults.baseURL}/results?${paramString}`)
  } else {
    const res = await axios.get('/results', { params })
    return res.data
  }
}

export async function deleteResults (params) {
  // safety
  if (!params.crawls && !params.query) {
    return console.log('trying to delete all results! aborting!')
  }

  const res = await axios.delete('/results', { params })
  store.totalResults -= res.data.deleted
  return res.data
}

export async function getLanguages (cache = true) {
  if (store.languages === null || !cache) {
    const res = await axios.get('/capabilities/languages')
    store.languages = res.data
  }

  return store.languages
}

export async function getCountries (cache = true) {
  if (store.countries === null || !cache) {
    const res = await axios.get('/capabilities/countries')
    store.countries = res.data
  }

  return store.countries
}

function triggerDownload (url) {
  const iframe = document.createElement('iframe')
  iframe.src = url
  iframe.style.display = 'none'

  document.body.insertBefore(iframe, document.body.firstChild)
  setTimeout(() => { document.body.removeChild(iframe) }, 100000)
}
