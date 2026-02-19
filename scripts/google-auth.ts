/**
 * One-time Google OAuth authentication script
 * 
 * Run this script locally to get a refresh token for Google Calendar API access.
 * The refresh token can then be stored in .env.local for headless operation on a Raspberry Pi.
 * 
 * Usage: pnpm google-auth
 * 
 * Prerequisites:
 * 1. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
 * 2. Have a browser available for OAuth consent
 */

import { google } from 'googleapis'
import * as http from 'http'
import * as url from 'url'
import open from 'open'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_PORT = 3333
const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth2callback`

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']

async function main() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local')
    console.error('\nPlease follow these steps:')
    console.error('1. Go to https://console.cloud.google.com')
    console.error('2. Create OAuth 2.0 credentials (Desktop app)')
    console.error('3. Copy the Client ID and Client Secret to .env.local')
    process.exit(1)
  }

  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  })

  console.log('\n🔐 Google Calendar Authentication\n')
  console.log('Opening browser for authorization...')
  console.log('If the browser does not open, visit this URL manually:\n')
  console.log(authUrl)
  console.log('')

  const code = await getAuthorizationCode(authUrl)
  
  try {
    const { tokens } = await oauth2Client.getToken(code)
    
    console.log('\n✅ Authentication successful!\n')
    console.log('Add the following to your .env.local file:\n')
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`)
    console.log('\n')
    
    if (!tokens.refresh_token) {
      console.log('⚠️  No refresh token received. This can happen if you have already authorized this app.')
      console.log('To get a new refresh token:')
      console.log('1. Go to https://myaccount.google.com/permissions')
      console.log('2. Remove access for this app')
      console.log('3. Run this script again')
    }
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    process.exit(1)
  }
}

function getAuthorizationCode(authUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      try {
        if (!req.url) {
          return
        }

        const parsedUrl = url.parse(req.url, true)
        
        if (parsedUrl.pathname === '/oauth2callback') {
          const code = parsedUrl.query.code as string
          const error = parsedUrl.query.error as string

          if (error) {
            res.writeHead(400, { 'Content-Type': 'text/html' })
            res.end(`
              <html>
                <body style="font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                  <div style="text-align: center;">
                    <h1 style="color: #ef4444;">Authorization Error</h1>
                    <p>Authorization was denied or failed. Please check the terminal for details.</p>
                  </div>
                </body>
              </html>
            `)
            console.error('OAuth error:', error)
            reject(new Error(`OAuth authorization failed: ${error}`))
            server.close()
            return
          }

          if (code) {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(`
              <html>
                <body style="font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                  <div style="text-align: center;">
                    <h1 style="color: #22c55e;">✓ Authorization Successful</h1>
                    <p>You can close this window and return to the terminal.</p>
                  </div>
                </body>
              </html>
            `)
            resolve(code)
            server.close()
          }
        }
      } catch (err) {
        reject(err)
      }
    })

    server.listen(REDIRECT_PORT, () => {
      open(authUrl).catch(() => {
        console.log('Could not open browser automatically.')
      })
    })

    server.on('error', (err) => {
      if ((err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
        console.error(`Port ${REDIRECT_PORT} is already in use. Please close any other applications using this port.`)
      }
      reject(err)
    })
  })
}

main()
