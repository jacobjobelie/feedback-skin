import SimplePeerWrapper from 'simple-peer-wrapper'

export async function run() {
  const options = {
    debug: false,
    serverUrl: 'http://localhost:3003',
  }

  // Create a new simple-peer-wrapper
  const spw = new SimplePeerWrapper(options)

  // Make the peer connection
  spw.connect()

  // When data recieved over the connection call gotData
  spw.on('data', gotData)

  function gotData(data) {
    console.log(data)
  }
}
