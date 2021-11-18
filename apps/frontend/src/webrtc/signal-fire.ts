import connect, { SessionAcceptedEvent } from '@signal-fire/client'

export async function run() {
  const client = await connect('ws://0.0.0.0:3003/socket')
  const session = await client.createSession('<target id>')

  //@ts-ignore
  session.addEventListener('accepted', async (ev: SessionAcceptedEvent) => {
    console.log('Session accepted!')

    const connection = ev.detail
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

    stream.getTracks().forEach((track) => {
      connection.addTrack(track, stream)
    })
  })

  session.addEventListener('rejected', () => {
    console.log('Session rejected')
  })

  session.addEventListener('timed-out', () => {
    console.log('Session timed out')
  })
}
