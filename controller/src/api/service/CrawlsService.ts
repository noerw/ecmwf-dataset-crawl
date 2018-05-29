import Crawl from '../../models/Crawl'
import {
  getCrawls as getCrawlsFromDb,
  getCrawl as getCrawlFromDb,
} from '../../elastic/controllers/crawls'

/**
 * Add a new Crawl
 *
 * crawl CrawlRequest
 * returns CrawlResponse
 */
export async function addCrawl (crawl: Crawl) {
  const doc = new Crawl(crawl)

  await doc.processKeywords()
  await doc.getSeedUrls()
  await doc.startCrawling()
  return doc
}

/**
 * Get a Crawl
 *
 * crawlId String Crawl ID to operate on
 * returns CrawlResponse
 */
export async function getCrawl (crawlId: string) {
  const crawl = await getCrawlFromDb({ id: crawlId })
  return crawl.serialize()
}

/**
 * Get all Crawls
 *
 * returns List
 */
export async function getCrawls () {
  const crawls = await getCrawlsFromDb()
  return Promise.all(crawls.map(c => c.serialize()))
}

/**
 * Only defined to handle preflight CORS requests
 *
 * no response value expected for this operation
 */
export async function handlePreflight () { /* placeholder */ }

/**
 * Only defined to handle preflight CORS requests
 *
 * crawlId String Crawl ID to operate on
 * no response value expected for this operation
 */
export async function handlePreflight2 () { /* placeholder */ }

/**
 * Stop a Crawl
 *
 * crawlId String Crawl ID to operate on
 * no response value expected for this operation
 */
export async function stopCrawl (crawlId: string) {
  const crawl = await getCrawlFromDb({ id: crawlId })
  return crawl.stopCrawling()
}
