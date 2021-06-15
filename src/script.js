import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import { Vector2 } from 'three'

 
/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 })
const debugObject = {
    surfaceColor: '#186691',
    depthColor: '#9bd8ff'
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Material
const waterMaterial = new THREE.ShaderMaterial({
     vertexShader: waterVertexShader,    
     fragmentShader: waterFragmentShader,
     uniforms: {
         uTime: {value: 0},
         uBigWavesElevation: {value: 0.2},
         uBigWavesFrequency: {value: new Vector2(4, 1.5)},
         uBigWavesSpeed: {value: 0.75},

         uSmallWavesElevation: {value: 0.15},
         uSmallWavesFrequency: {value: 3.0},
         uSmallWavesSpeed: {value: 0.2},
         uSmallIterations: {value: 4.0},

         uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
         uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
         uColorOffset: {value: 0.08},
         uColorMultiplier: {value: 5.0}
     }
})

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('FreqX')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('FreqY')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(2).step(0.001).name('speed')

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(10).step(0.001).name('smallFreqY')
gui.add(waterMaterial.uniforms.uSmallIterations, 'value').min(0).max(10).step(0.001).name('smallFreqY')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(2).step(0.001).name('smallSpeed')

gui.addColor(debugObject, 'depthColor').name('depthCol').onChange(() => {waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)})
gui.addColor(debugObject, 'surfaceColor').name('surfaceCol').onChange(() => {waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)})
gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('colOffset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(1).step(0.001).name('colMultiplier')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()