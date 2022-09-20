import { Root } from '@geogenesis/action-schema/assembly'
import { DataURI } from '@geogenesis/data-uri/assembly'
import { Bytes, log } from '@graphprotocol/graph-ts'
import { JSON } from 'assemblyscript-json/assembly'
import { EntryAdded } from '../generated/Log/Log'
import { LogEntry } from '../generated/schema'
import { handleAction } from './actions'
import { bootstrap } from './bootstrap'

bootstrap()

export function handleEntryAdded(event: EntryAdded): void {
  let entry = new LogEntry(event.params.index.toHex())

  const author = event.params.author
  const uri = event.params.uri

  entry.author = author
  entry.uri = uri

  if (uri.startsWith('data:')) {
    const dataURI = DataURI.parse(uri)

    if (dataURI) {
      const bytes = Bytes.fromUint8Array(dataURI.data)

      entry.mimeType = dataURI.mimeType
      entry.decoded = bytes

      if (entry.mimeType == 'application/json') {
        const json = JSON.parse(bytes)

        const root = Root.fromJSON(json)

        if (root) {
          handleRoot(root)
        }
      }
    }
  }

  entry.save()

  log.debug(`Indexed: ${entry.uri}`, [])
}

function handleRoot(root: Root) {
  for (let i = 0; i < root.actions.length; i++) {
    const action = root.actions[i]

    handleAction(action)
  }
}
