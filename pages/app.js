import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class PedroThermoDistance {
    constructor(firstText, secondText, thermometerSize, dp, options = { heating: 1, cooling: 1 }) {
        this.firstText = firstText;
        this.secondText = secondText;
        this.thermometerSize = thermometerSize;
        this.dp = dp;
        this.options = options;
    }

    static from(firstText, secondText, thermometerSize, options = { heating: 1, cooling: 1 }) {
        // [ltr, rtl][firstTextLen][secondTextLen][thermometerSize]
        const dp = new Array(firstText.length + 1).fill(0).map(() =>
            new Array(secondText.length + 1).fill(0).map(() => {
                return new Array(thermometerSize).fill(0).map(() => [0, 0])
            })
        );

        // Laterals
        for (let i = 1; i <= firstText.length; i++) {
            for (let a = 0; a < thermometerSize; a++) {
                dp[i][0][a][0] = dp[i - 1][0][Math.max(a - (options?.cooling || 1), 0)][0] + (thermometerSize - a);
                dp[i][0][a][1] = dp[i - 1][0][Math.max(a - (options?.cooling || 1), 0)][1] + (thermometerSize - a);
            }
        }
        for (let i = 1; i <= secondText.length; i++) {
            for (let a = 0; a < thermometerSize; a++) {
                dp[0][i][a][0] = dp[0][i - 1][Math.max(a - (options?.cooling || 1), 0)][0] + (thermometerSize - a);
                dp[0][i][a][1] = dp[0][i - 1][Math.max(a - (options?.cooling || 1), 0)][1] + (thermometerSize - a);
            }
        }

        //
        for (let i = 0; i < firstText.length; i++) {
            for (let j = 0; j < secondText.length; j++) {
                for (let a = 0; a < thermometerSize; a++) {


                    const cost = thermometerSize - a
                    const heat = Math.min(a + (options?.heating || 1), thermometerSize - 1)
                    const cold = Math.max(a - (options?.cooling || 1), 0)

                    // Left to Right
                    {
                        const cutsCandidatesLTR = []

                        // Normal Compare
                        if (firstText.charAt(i) === secondText.charAt(j))
                            cutsCandidatesLTR.push(dp[i][j][heat][0])

                        // Delete
                        cutsCandidatesLTR.push(dp[i + 1][j][cold][0] + cost)
                        cutsCandidatesLTR.push(dp[i][j + 1][cold][0] + cost)
                        if (j === 6 && i === 2 && a === 0) {
                            console.log(cutsCandidatesLTR)
                        }
                        // Transversal Compare
                        const transversal = (i >= 1 && j >= 1)
                            && (firstText.charAt(i - 1) === secondText.charAt(j)
                                && firstText.charAt(i) === secondText.charAt(j - 1))
                        if (transversal)
                            cutsCandidatesLTR.push(dp[i - 1][j - 1][cold][0])


                        dp[i + 1][j + 1][a][0] = Math.min(...cutsCandidatesLTR)
                    }

                    // Right to Left
                    {
                        const cutsCandidatesRTL = []

                        // Normal Compare
                        if (firstText.charAt(firstText.length - i - 1) === secondText.charAt(secondText.length - j - 1))
                            cutsCandidatesRTL.push(dp[i][j][heat][1])

                        // Delete
                        cutsCandidatesRTL.push(dp[i + 1][j][cold][1] + cost)
                        cutsCandidatesRTL.push(dp[i][j + 1][cold][1] + cost)

                        // Transversal Compare
                        const transversal = (i >= 1 && j >= 1)
                            && (firstText.charAt(firstText.length - i) === secondText.charAt(secondText.length - j - 1)
                                && firstText.charAt(firstText.length - i - 1) === secondText.charAt(secondText.length - j))
                        if (transversal)
                            cutsCandidatesRTL.push(dp[i - 1][j - 1][cold][1])

                        dp[i + 1][j + 1][a][1] = Math.min(...cutsCandidatesRTL)
                    }
                }
            }
        }

        return new PedroThermoDistance(firstText, secondText, thermometerSize, dp, options)
    }

    traverseTo(impulse = 1, directionDim = 0, callback = null) {
        let i = this.firstText.length - 1
        let j = this.secondText.length - 1

        let temperature = Math.max(0, Math.min(this.thermometerSize - 1, Math.round((this.thermometerSize - 1) * impulse)))
        let measurements = []

        let matchedText1 = ""
        let matchedText2 = ""

        if (callback) callback(i + 1, j + 1, temperature, matchedText1, matchedText2)

        while (i >= 0 || j >= 0) {

            if (i === -1) {
                measurements.push(this.thermometerSize - temperature)
                matchedText2 = `-` + matchedText2
                j--
                temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
                if (callback) callback(i + 1, j + 1, temperature, matchedText1, matchedText2)
                continue
            } else if (j === -1) {
                measurements.push(this.thermometerSize - temperature)
                matchedText1 = '-' + matchedText1
                i--
                temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
                if (callback) callback(i + 1, j + 1, temperature, matchedText1, matchedText2)
                continue
            }

            let charPositionI = directionDim === 0 ? i : (this.firstText.length - i - 1)
            let charPositionJ = directionDim === 0 ? j : (this.secondText.length - j - 1)
            let choices = []

            const cost = this.thermometerSize - temperature
            const heat = Math.min(temperature + (this.options?.heating || 1), this.thermometerSize - 1)
            const cold = Math.max(temperature - (this.options?.cooling || 1), 0)

            if (this.firstText.charAt(charPositionI) === this.secondText.charAt(charPositionJ)) {
                choices.push({
                    measurement: 0,
                    cost: this.dp[i][j][heat][directionDim],
                    newMatchedText1: this.firstText.charAt(charPositionI) + matchedText1,
                    newMatchedText2: this.secondText.charAt(charPositionJ) + matchedText2,
                    newTemperature: heat,
                    newI: i - 1,
                    newJ: j - 1
                })
            }

            let tDirection = directionDim === 0 ? -1 : 1
            const transversal = (i >= 1 && j >= 1)
                && (this.firstText.charAt(charPositionI + tDirection) === this.secondText.charAt(charPositionJ)
                    && this.firstText.charAt(charPositionI) === this.secondText.charAt(charPositionJ + tDirection))

            if (transversal) {
                choices.push({
                    measurement: 0,
                    cost: this.dp[i - 1][j - 1][cold][directionDim],
                    newMatchedText1: this.firstText.charAt(charPositionI) + this.firstText.charAt(charPositionI + tDirection) + matchedText1,
                    newMatchedText2: this.firstText.charAt(charPositionI) + this.firstText.charAt(charPositionI + tDirection) + matchedText2,
                    newTemperature: cold,
                    newI: i - 2,
                    newJ: j - 2,
                    isTransversal: true
                })
            }

            choices.push({
                measurement: cost,
                cost: this.dp[i + 1][j][cold][directionDim] + cost,
                newMatchedText1: matchedText1,
                newMatchedText2: `-` + matchedText2,
                newTemperature: cold,
                newI: i,
                newJ: j - 1
            })

            choices.push({
                measurement: cost,
                cost: this.dp[i][j + 1][cold][directionDim] + cost,
                newMatchedText1: '-' + matchedText1,
                newMatchedText2: matchedText2,
                newTemperature: cold,
                newI: i - 1,
                newJ: j
            })

            choices.sort((a, b) => a.cost - b.cost)

            const best = choices[0]

            measurements.push(best.measurement)
            matchedText1 = best.newMatchedText1
            matchedText2 = best.newMatchedText2
            temperature = best.newTemperature
            i = best.newI
            j = best.newJ
            if (callback) callback(i + 1, j + 1, temperature, matchedText1, matchedText2)
            if (best.isTransversal && callback)  callback(i + 2, j + 2, temperature, matchedText1, matchedText2)
        }

        //
        return {
            matchedText1,
            matchedText2,
            measurements
        }
    }

    traverse(impulse = 1) {
        const ltr = this.traverseTo(impulse, 0)
        const rtl = this.traverseTo(impulse, 1)
        return {
            ltr,
            rtl
        }
    }

    distance(impulse = 1, direction = 'ltr') {
        const startOn = Math.max(0, Math.min(this.thermometerSize - 1, Math.round((this.thermometerSize - 1) * impulse)))
        return this.dp[this.firstText.length][this.secondText.length][startOn][direction === 'ltr' ? 0 : 1]
    }

    maxDistance(impulse = 1) {
        let maxDistance = 0
        let temperature = Math.round(Math.max(0, Math.min(this.thermometerSize - 1, (this.thermometerSize - 1) * impulse)))

        for (let i = 0; i < (this.firstText.length + this.secondText.length); i++) {
            maxDistance += this.thermometerSize - temperature
            temperature = Math.max(temperature - (this.options?.cooling || 1), 0)
        }

        return maxDistance
    }

    similarityTo(impulse = 1, direction = 'ltr') {
        return 1 - this.distance(impulse, direction) / this.maxDistance(impulse)
    }

    similarity(impulse = 1) {
        return Math.max(this.similarityTo(impulse, 'ltr'), this.similarityTo(impulse, 'rtl'))
    }

    localSimilarity(impulse, softness = 0.5) {
        //
        function standardDeviation(measurements) {
            let mean = measurements.reduce((prev, curr) => prev + curr, 0) / measurements.length
            return Math.sqrt(measurements.reduce((prev, curr) => prev + Math.pow(curr - mean, 2), 0) / (measurements.length - 1))
        }

        //
        const { ltr, rtl } = this.traverse(impulse)

        const similarity1 = this.similarityTo(impulse, 'ltr')
        const similarity1W = 1 - Math.abs(0.5 - similarity1) / 0.5
        const standardDeviation1W = standardDeviation(ltr.measurements) * Math.pow(similarity1W, softness)
        const localSimilarity1 = Math.min(1, similarity1 / Math.max(1, standardDeviation1W))

        const similarity2 = this.similarityTo(impulse, 'rtl')
        const similarity2W = 1 - Math.abs(0.5 - similarity2) / 0.5
        const standardDeviation2W = standardDeviation(rtl.measurements) * Math.pow(similarity2W, softness)
        const localSimilarity2 = Math.min(1, similarity2 / Math.max(1, standardDeviation2W))

        return {
            ltr: localSimilarity1,
            rtl: localSimilarity2
        }
    }
}

function color(a, b, l) {
    l = Math.max(0, Math.min(1, l));

    var r1 = a >> 16 & 255;
    var g1 = a >> 8 & 255;
    var b1 = a & 255;
    var r2 = b >> 16 & 255;
    var g2 = b >> 8 & 255;
    var b2 = b & 255;

    var r = Math.round(r1 * (1 - l) + r2 * l);
    var g = Math.round(g1 * (1 - l) + g2 * l);
    var b = Math.round(b1 * (1 - l) + b2 * l);

    return (r << 16 | g << 8 | b);
}

class ThreePTDScene {

    constructor(scene, camera, renderer, controls) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
        this.impulse = 1
        this.blockSize = 0.5;
        this.gap = 0.1;
        this.onalign = null
        this.animation = {
            stack: [],
            control: null,
            started: false
        }
    }

    static createScene() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        return new ThreePTDScene(scene, camera, renderer, controls);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    setPtd({ firstText, secondText, thermometerSize, options, impulse }) {
        this.ptd = PedroThermoDistance.from(firstText, secondText, thermometerSize, options)
        this.impulse = impulse

        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
        this.createGeometry();
        this.updateCameraAndControls();
    }

    updateCameraAndControls() {
        let maxX = 0, maxY = 0, maxZ = 0;

        this.ptd.dp.forEach((layer, i) => {
            layer.forEach((row, j) => {
                row.forEach((_, a) => {
                    maxX = Math.max(maxX, i);
                    maxY = Math.max(maxY, j);
                    maxZ = Math.max(maxZ, a);
                });
            });
        });

        const blockSize = 0.5;
        const gap = 0.1;

        const centerX = (maxX / 2) * (blockSize + gap);
        const centerY = (maxY / 2) * (blockSize + gap);
        const centerZ = (maxZ / 2) * (blockSize + gap);

        this.camera.position.set(centerX, centerY, centerZ + Math.max(maxX, maxY, maxZ));
        this.camera.lookAt(centerX, centerY, centerZ);

        this.controls.target.set(centerX, centerY, centerZ);
        this.controls.update();
    }

    createGeometry() {
        const dp = this.ptd.dp;

        const cubes = new Array(dp.length).fill(0).map(() =>
            new Array(dp[0].length).fill(0).map(() => {
                return new Array(dp[0][0].length).fill(null)
            })
        );

        for (let i = 0; i < dp.length; i++) {
            for (let j = 0; j < dp[i].length; j++) {
                for (let a = 0; a < dp[i][j].length; a++) {
                    const color = new THREE.Color(0.5, 0.5, 0.5);

                    //
                    const geometry = new THREE.BoxGeometry(this.blockSize, this.blockSize, this.blockSize);
                    const material = new THREE.MeshBasicMaterial({
                        color: color,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.1,
                    });

                    const cube = new THREE.Mesh(geometry);
                    cube.material = material

                    // 
                    cube.position.x = i * (this.blockSize + this.gap);
                    cube.position.y = j * (this.blockSize + this.gap);
                    cube.position.z = a * (this.blockSize + this.gap);
                    cubes[i][j][a] = cube

                    // 
                    this.scene.add(cube);
                }
            }
        }

        const localSimilarity = this.ptd.localSimilarity(this.impulse)
        const directionDim = localSimilarity.ltr > localSimilarity.rtl ? 0 : 1

        if (this.animation.started)
            clearInterval(this.animation.control)

        this.animation.stack = []
        this.ptd.traverseTo(this.impulse, directionDim, (i, j, t, mt1, mt2) => {
            cubes[i][j][t].material.color = new THREE.Color(color(0x0000ff, 0xff0000, (t + 1) / 3))
            cubes[i][j][t].material.opacity = 1
            this.animation.stack.push({
                i, j, t, mt1, mt2
            })
        })

        this.animation.started = true
        this.animation.control = setTimeout(() => {
            // Reset colors
            this.ptd.traverseTo(this.impulse, directionDim, (i, j, t, mt1, mt2) => {
                cubes[i][j][t].material.color = new THREE.Color(0.5, 0.5, 0.5)
                cubes[i][j][t].material.opacity = 1
            })

            this.animation.control = setInterval(() => {
                if (this.animation.stack.length === 0) {
                    clearInterval(this.animation.control)
                    this.animation.started = false
                    return
                }

                const { i, j, t, mt1, mt2 } = this.animation.stack.shift()
                cubes[i][j][t].material.color = new THREE.Color(color(0x0000ff, 0xff0000, (t + 1) / 3))
                cubes[i][j][t].material.opacity = 1

                if (this.onalign) {
                    this.onalign(mt1, mt2, directionDim === 0)
                }
            }, 1000)

        }, 1500)
    }
}


const ptdScene = ThreePTDScene.createScene()
ptdScene.animate()

const alignedText1 = document.getElementById('alignedText1')
const alignedText2 = document.getElementById('alignedText2')
const reversedText = document.getElementById('reversed')
const localSimilarity = document.getElementById('localSimilarity')

ptdScene.onalign = (text1, text2, reversed) => {
    alignedText1.innerText = text1
    alignedText2.innerText = text2
    if (reversed) reversedText.innerText = 'Best fit dir: Left to Right'
    else reversedText.innerText = 'Best fit dir: Right to Left'

}

function updateVisualization() {
    const firstText = document.getElementById('inputText1').value;
    const secondText = document.getElementById('inputText2').value;
    const thermometerSize = parseInt(document.getElementById('thermometerSize').value);
    const heating = parseInt(document.getElementById('heating').value);
    const cooling = parseInt(document.getElementById('cooling').value);
    const impulse = parseFloat(document.getElementById('impulse').value);

    ptdScene.setPtd({
        firstText,
        secondText,
        thermometerSize,
        options: {
            heating,
            cooling
        },
        impulse
    })

    const { ltr, rtl } = ptdScene.ptd.localSimilarity(impulse)
    localSimilarity.innerHTML = Math.max(ltr, rtl)
}
window.updateVisualization = updateVisualization;
updateVisualization()