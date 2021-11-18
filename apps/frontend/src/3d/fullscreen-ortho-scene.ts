// import { OrbitControls } from './orbit'
import { cover } from 'intrinsic-scale'
import {
  scale,
  rotate,
  translate,
  compose,
  toCSS,
  applyToPoint,
} from 'transformation-matrix'
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
import { selectedVideoRes } from './constants'

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
  const vSize = selectedVideoRes.value
  // const rtScene = new Scene()
  // const rtWidth = 1024
  // const rtHeight = 1024
  // const renderTarget = new WebGLRenderTarget(rtWidth, rtHeight, {
  //   wrapS: ClampToEdgeWrapping,
  //   wrapT: ClampToEdgeWrapping,
  // })
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

  const renderer = new WebGLRenderer({
    // canvas: sceneCanvasEl,
    // powerPreference: 'high-performance',
    // antialias: false,
    // stencil: false,
    // depth: false,
    // precision: 'highp',
  })
  // render.ap
  sceneCanvasEl.appendChild(renderer.domElement)
  renderer.setSize(vSize.w, vSize.h)
  sceneCanvasEl.width = vSize.w
  sceneCanvasEl.height = vSize.h

  const camera = new OrthographicCamera(
    frustumSize / -2,
    frustumSize / 2,
    (frustumSize * aspect) / 2,
    (frustumSize * aspect) / -2,
    0.1,
    100,
  )
  camera.position.z = 1

  function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    console.log(width, height)
    // adjust displayBuffer size to match
    // if (canvas.width !== width || canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    camera.left = frustumSize / -2
    camera.right = frustumSize / 2
    camera.top = (frustumSize * ASPECT_H_W) / 2
    camera.bottom = (-frustumSize * ASPECT_H_W) / 2
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)

    // update any render target sizes here
    // }
  }

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

  const geoScale = 2
  const Apoints = new Mesh(
    new PlaneBufferGeometry(geoScale, geoScale * ASPECT_H_W, 1, 1),
    AshaderMaterial,
  )
  scene.add(Apoints)
  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    const { x, y, height, width } = cover(w, h, vSize.w, vSize.h)
    const wS = width / vSize.w
    const hS = height / vSize.h
    const s = Math.max(wS, hS)
    const xx = (w - vSize.w) / 2 + x
    const yy = (h - vSize.h) / 2 + y
    let matrix = compose(translate(xx, yy), scale(s, s))
    renderer.domElement.style.transform = toCSS(matrix)
  }

  function animate(time: number) {
    requestAnimationFrame(animate)

    render(time)
  }

  let pTime = 0
  function render(time: number) {
    if (time - pTime > FPS) {
      renderer.render(scene, camera)
      pTime = time
    }
  }
  animate(0)
  setTimeout(() => {
    renderer.domElement.setAttribute('width', `${vSize.w}`)
    renderer.domElement.setAttribute('height', `${vSize.h}`)
    renderer.domElement.style.width = `${vSize.w}px`
    renderer.domElement.style.height = `${vSize.h}px`
    renderer.domElement.style.position = 'absolute'
    resizeCanvasToDisplaySize()
    onWindowResize()
  })

  return {
    canvas: renderer.domElement,
  }
}
