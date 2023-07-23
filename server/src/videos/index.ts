import os from 'os'
import fs from 'fs'
import express, { Request, Response, Router } from 'express'
import multer from 'multer'
import { google } from 'googleapis'
import { OAuth2Client } from 'googleapis-common'
import { Credentials } from 'google-auth-library'

const upload = multer({ dest: os.tmpdir() })

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload'
]
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/'
const TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json'

const OAuth2 = google.auth.OAuth2
let oauth2Client: OAuth2Client | null = null

fs.readFile('client_secret.json', (err, content) => {
  if (err) {
    console.log('Error loading client secret file: ' + err)
    return
  }

  const credentials = JSON.parse(content.toString())
  const clientSecret = credentials.web.client_secret
  const clientId = credentials.web.client_id
  const redirectUrl = credentials.web.redirect_uris[0]
  oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)
})

const storeToken = (token: Credentials) => {
  try {
    fs.mkdirSync(TOKEN_DIR)
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err
    console.log('Token stored to ' + TOKEN_PATH)
  })
}

export const uploadVideo = async (auth: OAuth2Client, file: Express.Multer.File) => {
  const service = google.youtube('v3')
  try {
    const response = await service.videos.insert(
      {
        auth: auth,
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title: 'test',
            description: 'test',
          },
          status: {
            privacyStatus: 'unlisted'
          },
        },
        media: {
          body: fs.createReadStream(file.path),
        },
      }
    )
    console.log(response)
    const videoUrl = 'https://www.youtube.com/watch?v=' + response.data.id
    console.log('videoUrl in uploadVideo: ' + videoUrl)
    return videoUrl
  } catch (err) {
    console.log('The API returned an error: ' + err)
  }
}

// eslint-disable-next-line new-cap
export const NodeExpressRouter = express.Router()

NodeExpressRouter.post(
  '/create',
  upload.single('file'),
  async (req: Request, res: Response) => {
    try {
      const file = req.file
      console.log(file)

      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, async (err, token) => {
        if (err) {
          const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
          })
          console.log(authUrl)
          res.status(200).send({ authUrl })
        } else {
          oauth2Client.credentials = JSON.parse(token.toString())
          const videoUrl = await uploadVideo(oauth2Client, file)
          console.log('videoUrl in post:' + videoUrl)
          res.status(200).send({ videoUrl })
        }
      })
    } catch (e) {
      res.status(500).send(e.message)
    }
  }
)

NodeExpressRouter.get('/oauth_callback', (req: Request, res: Response) => {
  const code = req.query.code as string
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      console.log('Error while trying to retrieve access token', err)
      return
    }
    oauth2Client.credentials = token
    storeToken(token)
    res.status(200).send(
      { response: 'Youtube authentication complete. You can now upload the video' }
    )
  })
})

export class VideoRouter {
  getExpressRouter = (): Router => {
    return NodeExpressRouter
  }
}
