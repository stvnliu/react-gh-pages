import { render } from '@testing-library/react';
import { ReactElement, useEffect, useRef } from 'react';
import * as THREE from 'three';
import logo from "./texturemap.jpeg";

import './App.css';
export const ThreeApp = (): ReactElement => {
    const refContainer = useRef<HTMLDivElement>(null);
    useEffect(() => {
        console.log("effect running...")
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000)
        scene.backgroundIntensity = 0.2
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        window.onresize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.render(scene, camera)
        }
        // render objects
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({});
        material.map = new THREE.TextureLoader().load(logo)
        const cube = new THREE.Mesh(geometry, material);
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        scene.add(directionalLight)
        scene.add(ambientLight)
        scene.add(cube);
        document.body.appendChild(renderer.domElement);

        camera.position.z = 5;
        camera.position.y = 2;
        camera.lookAt(cube.position)

        // progressive animation through scrolling
        function lerp(x: number, y: number, a: number): number {
            return (1 - a) * x + a * y
        }
        function scalePercent(start: number, end: number) {
            return (scrollPercent - start) / (end - start)
        }
        const animationKeyframes: { start: number; end: number; func: () => void }[] = []

        animationKeyframes.push({
            start: 0,
            end: 15,
            func: () => {
                camera.lookAt(cube.position.x - 5, cube.position.y, cube.position.z - 10)
                cube.rotation.x += 0.01
                cube.rotation.y += 0.01
                cube.position.z = lerp(0, 5, scalePercent(0, 15))
                cube.position.x = lerp(10, -10, scalePercent(0, 15))

                //console.log(cube.position.z)
            },
        })
        animationKeyframes.push({
            start: 15,
            end: 30,
            func: () => {
                cube.rotation.x += 0.01
                cube.rotation.y += 0.01
                camera.lookAt(cube.position.x - 5, cube.position.y, cube.position.z - 10)
                //console.log(cube.rotation.z)
            },
        })
        animationKeyframes.push({
            start: 30,
            end: 45,
            func: () => {
                cube.rotation.x += 0.01
                cube.rotation.y += 0.01
                camera.position.x = lerp(0, 5, scalePercent(30, 45))
                camera.position.z = lerp(5, -5, scalePercent(30, 45))
                camera.lookAt(lerp(cube.position.x - 5, cube.position.x + 10, scalePercent(30, 45)), cube.position.y, lerp(cube.position.z - 10, cube.position.z + 10, scalePercent(30, 45)))
                //console.log(camera.position.x + " " + camera.position.y)
            },
        })
        animationKeyframes.push({
            start: 45,
            end: 60,
            func: () => {
                cube.rotation.x += 0.01
                cube.rotation.y += 0.01
                camera.lookAt(cube.position.x + 10, cube.position.y, cube.position.z + 10)
                //console.log(cube.rotation.z)
            },
        })
        animationKeyframes.push({
            start: 60,
            end: 70,
            func: () => {
                //auto rotate
                cube.rotation.x += 0.01
                cube.rotation.y += 0.01
                cube.position.x = lerp(-10, 20, scalePercent(60, 70))
                camera.lookAt(lerp(cube.position.x + 10, cube.position.x - 10, scalePercent(60, 70)), cube.position.y, cube.position.z + 10)
            },
        })
        animationKeyframes.push({
            start: 70,
            end: 80,
            func: () => {
                cube.rotation.x += 0.01
                cube.rotation.y += 0.01
                camera.lookAt(cube.position.x - 10, cube.position.y, cube.position.z + 10)
            },
        })
        animationKeyframes.push({
            start: 80,
            end: 101,
            func: () => {
                cube.rotation.x += 0.01
                cube.rotation.y += 0.01
                cube.position.x = lerp(20, -5, scalePercent(80, 100))
                camera.lookAt(lerp(cube.position.x - 10, cube.position.x + 10, scalePercent(80, 101)), cube.position.y, cube.position.z + 10)
            },
        })

        function playScrollAnimations() {
            animationKeyframes.forEach((a) => {
                if (scrollPercent >= a.start && scrollPercent < a.end) {
                    a.func()
                }
            })
        }

        let scrollPercent = 0
        window.onscroll = () => {
            scrollPercent =
                ((document.documentElement.scrollTop || document.body.scrollTop) /
                    ((document.documentElement.scrollHeight ||
                        document.body.scrollHeight) -
                        document.documentElement.clientHeight)) *
                100;
        }

        function animate() {
            requestAnimationFrame(animate);
            playScrollAnimations()
            renderer.render(scene, camera);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
        animate();
    }, [])

    return (
        <main ref={refContainer}>
            <h1>zhongheng-liu.github.io</h1>
            <section className='left'>
                <h2>Steven Liu</h2>
                <p>I write sometimes-functional code in JavaScript React, Java, and a bit of Python.</p>
            </section>
            <section className='right'>
                <h2>Changing Objects Position</h2>
                <p>The cubes position is now changing</p>
            </section>

            <section className='left'>
                <h2>Changing Objects Rotation</h2>
                <p>The cubes rotation is now changing</p>
            </section>

            <section className='right'>
                <h2>Changing Camera Position</h2>
                <p>The camera position is now changing</p>
            </section>

            <section className='left'>
                <h2>You are at the bottom</h2>
                <p>The cube will now be auto rotating</p>
                <p>
                    Now you can scroll back to the top to reverse the animation
                </p>
            </section>
        </main>
    )
}