import { creatChunk } from './creatChunk.js'

// eslint-disable-next-line no-undef
// importScripts('./spark-md5.min')

self.addEventListener('message', async (e) => {

  const {
    file,
    start,
    end,
    CHUNK_SIZE,
  } = e.data

  let result = []

  for (let i = start; i < end; i++) {
    const chunkPromise = creatChunk(file, start, end, CHUNK_SIZE)
    result.push(chunkPromise)
  }

  const chunks = await Promise.all(result)

  // eslint-disable-next-line no-undef
  self.postMessage(chunks)
}, false)
