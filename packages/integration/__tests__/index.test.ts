import 'jest'
import pRetry from 'p-retry'

// 1 minute
jest.setTimeout(120000)

type NodeError = {
  errno: number
  code: string
  syscall: string
  address: string
  port: string
}

async function checkRunning() {
  const url = 'http://localhost:8000/subgraphs/name/example'

  let json: any

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'query { gravatars { id } }',
      }),
    })

    json = await response.json()
  } catch (e) {
    if ((e as { cause: NodeError }).cause.code === 'ECONNREFUSED') {
      throw new Error(`Connection refused by '${url}'`)
    }

    throw new Error(e as any)
  }

  if ('errors' in json) {
    throw new Error(json.errors.map((item: any) => item.message).join('\n'))
  }

  return json
}

test('subgraph runs', async () => {
  const retries = 20
  const data = await pRetry(checkRunning, {
    retries,
    factor: 1,
    minTimeout: 5 * 1000,
    maxTimeout: 5 * 1000,
    onFailedAttempt: error => {
      console.log(`(${error.attemptNumber}/${retries}) ${error.message}`)
    },
  })

  expect(data).toEqual({ data: { gravatars: [] } })
})
