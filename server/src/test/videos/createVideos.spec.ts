import fs from 'fs'
import { google } from 'googleapis'
import { uploadVideo } from '../../videos/'

jest.mock('fs')
fs.createReadStream = jest.fn()

jest.mock('googleapis')
const insert = jest.fn()
google.youtube = jest.fn()
// @ts-ignore
google.youtube.mockImplementation(() => ({ videos: { insert } }))

describe('Unit Test: Create Video', () => {
  test('test upload video', async () => {
    const auth = jest.fn()
    const file = { path: 'test' }
    // @ts-ignore
    await uploadVideo(auth, file)

    // @ts-ignore
    expect(google.youtube).toHaveBeenCalled()
    expect(insert).toHaveBeenCalled()
  })
})
