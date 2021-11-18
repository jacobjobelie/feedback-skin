import SocketPeer from './socket-peer'

export async function run() {
  var peer = new SocketPeer({
    pairCode: 'yolo',
    url: 'http://localhost:3003/socketpeer/',
  })

  let stream

  peer.on('connect', function (c) {
    console.log(c)
    console.log('peer connected')
  })

  peer.on('connect_timeout', function () {
    console.error('connection timed out (after %s ms)', peer.timeout)
  })

  peer.on('data', function (data) {
    console.log('data received:', data)
  })

  peer.on('rtc.signal', function () {
    console.log('WebRTC signalling')
  })

  peer.on('peer.found', function (data) {
    console.log(data)
    console.log(peer)
    console.log('peer found:', data.initiator)
    peer.send('hello')
  })

  peer.on('upgrade', function () {
    console.log('successfully upgraded WebSocket ⇒ to WebRTC peer connection')
    peer.send('upgraded')
  })

  peer.on('upgrade_attempt', function () {
    console.log(
      'attempting to upgrade WebSocket ⇒ to WebRTC peer connection (attempt number: %d)',
      peer._connections.rtc.attempt,
    )
  })

  peer.on('downgrade', function () {
    console.log('downgraded WebRTC peer connection ⇒ to WebSocket connection')
  })

  peer.on('warning', function (data) {
    console.error('warning:', data.message)
  })

  peer.on('error', function (err) {
    console.error('error:', err)
  })

  return {
    peer,
    setStream(s) {
      stream = s
    },
  }
}
