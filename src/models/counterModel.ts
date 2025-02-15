import { getDB } from '~/configs/mongodb.js'

const COUNTER_COLLECTION_NAME = 'counters'

const getNextSequenceValue = async (sequenceName: string) => {
  const result = await getDB()
    .collection(COUNTER_COLLECTION_NAME)
    .findOneAndUpdate({ _id: sequenceName }, { $inc: { sequence_value: 1 } }, { returnDocument: 'after', upsert: true })

  return result ? result.sequence_value : null
}

export { getNextSequenceValue }
