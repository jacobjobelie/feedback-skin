// import { OrbitControls } from './orbit'
import {
  ClampToEdgeWrapping,
  DataTexture,
  LuminanceFormat,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneBufferGeometry,
  Scene,
  ShaderMaterial,
  VideoTexture,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three'

const ASPECT_H_W = 0.75
const FPS = 1000 / 25

const vert = `

precision highp float;

attribute float alpha;
varying vec2 vUv;

void main() {
 vUv = uv;
 vec3 pos = position;

 vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
 gl_Position = projectionMatrix * mvPosition;
}

`

const frag = `

precision highp float;

    varying vec2 vUv;


     uniform sampler2D tWebcam;
     uniform sampler2D tPeer;


     void main() {
      vec3 c = mix( texture2D(tWebcam, vUv.xy ).rgb, texture2D(tPeer, vUv.xy ).rgb, .5);
      gl_FragColor = vec4( c, 1. );

     }
`

interface Options {
  sceneCanvasEl: HTMLCanvasElement
  webcamVidEl: HTMLVideoElement
  peerVidEl: HTMLVideoElement
}
export function FBWScene(options: Options) {
  const { sceneCanvasEl, webcamVidEl, peerVidEl } = options
  const scene = new Scene()
  const rtScene = new Scene()
  const rtWidth = 1024
  const rtHeight = 1024
  const renderTarget = new WebGLRenderTarget(rtWidth, rtHeight, {
    wrapS: ClampToEdgeWrapping,
    wrapT: ClampToEdgeWrapping,
  })
  // const camera = new PerspectiveCamera(
  //   75,
  //   window.innerWidth / window.innerHeight,
  //   0.1,
  //   1000,
  // )
  var frustumSize = 2
  var aspect = window.innerHeight / window.innerWidth
  if (window.innerHeight > window.innerWidth) {
    //aspect = window.innerHeight / window.innerWidth;
    aspect = window.innerWidth / window.innerHeight
  } else {
    aspect = window.innerHeight / window.innerWidth
  }

  const camera = new OrthographicCamera(
    frustumSize / -2,
    frustumSize / 2,
    (frustumSize * aspect) / 2,
    (frustumSize * aspect) / -2,
    0.1,
    100,
  )
  camera.position.z = 1

  const renderer = new WebGLRenderer({
    canvas: sceneCanvasEl,
    powerPreference: 'high-performance',
    antialias: false,
    stencil: false,
    depth: false,
    precision: 'highp',
  })
  var AshaderMaterial = new ShaderMaterial({
    uniforms: {
      // uAlpha: { value: obj.alpha },
      tWebcam: { value: new VideoTexture(webcamVidEl) },
      tPeer: { value: new VideoTexture(peerVidEl) },
    },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: false,
  })

  renderer.setSize(window.innerWidth, window.innerHeight)
  // const controls = new OrbitControls(camera, renderer.domElement)

  // const webcamMat = new MeshBasicMaterial({ map: texture })
  const scale = 2
  const Apoints = new Mesh(
    new PlaneBufferGeometry(scale, scale * ASPECT_H_W, 1, 1),
    AshaderMaterial,
  )
  scene.add(Apoints)
  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
    if (window.innerHeight > window.innerWidth * ASPECT_H_W) {
      frustumSize = 2 * ASPECT_H_W
      aspect = window.innerWidth / window.innerHeight
      camera.left = (frustumSize * aspect) / -2
      camera.right = (frustumSize * aspect) / 2
      camera.top = frustumSize / 2
      camera.bottom = -frustumSize / 2
    } else {
      frustumSize = 2
      aspect = window.innerHeight / window.innerWidth
      camera.left = frustumSize / -2
      camera.right = frustumSize / 2
      camera.top = (frustumSize * aspect) / 2
      camera.bottom = (-frustumSize * aspect) / 2
    }
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function animate(time: number) {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    // controls.update()
    // myText.material.uniforms.resolution.value.set(el.width, el.height, 1)
    // myText.material.uniforms.time.value = time

    render(time)
  }

  let pTime = 0
  function render(time: number) {
    if (time - pTime > FPS) {
      renderer.render(scene, camera)
      pTime = time
    }
    // renderer.setRenderTarget(renderTarget)
    // renderer.render(rtScene, camera)
    // renderer.setRenderTarget(null)
  }
  onWindowResize()
  animate(0)
}
