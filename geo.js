function abstCreateMatrix(createObj) {
    function createMatrix({ nx = 3, ny = 3, nz = 3, dist = 2 } = {}) {
        const container = new THREE.Object3D();

        for (let x = -nx + 1; x < nx; x++) {
            for (let y = -ny + 1; y < ny; y++) {
                for (let z = 0; z < nz; z++) {
                    const obj = createObj();
                    obj.position.x = x * dist
                    obj.position.y = y * dist
                    obj.position.z = -z * dist
                    container.add(obj);
                }
            }
        }
        return container;
    }
    return createMatrix
}

// cube
function createCube() {
    // plane
    const cube = new THREE.Object3D();
    const xrot = [0, 1, 2, 3, 0, 0]
    const yrot = [0, 0, 0, 0, 1, 3]
    const color = "0000ff,ff00ff,ffff00,00ff00,ff0000,00ffff".split(",").map(s => "#" + s);
    for (let i = 0; i < xrot.length; i++) {
        const geo = new THREE.PlaneGeometry(1, 1);
        const mat = new THREE.MeshBasicMaterial({ color: color[i], transparent: true, opacity: 0.7, });
        const plane = new THREE.Mesh(geo, mat);
        plane.rotation.x = xrot[i] * Math.PI / 2
        plane.rotation.y = yrot[i] * Math.PI / 2
        plane.translateZ(0.5);
        cube.add(plane);
    }

    // line
    const lines = (function () {
        const lines = new THREE.Object3D();
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const rotx = [0, 1, 0]
        const rotz = [0, 0, 1]
        const pos0 = [0, 0, 0, 0]
        const pos11 = [-0.5, -0.5, 0.5, 0.5]
        const pos222 = [-0.5, 0.5, -0.5, 0.5]
        const dx = [pos11, pos222, pos0]
        const dy = [pos0, pos11, pos222]
        const dz = [pos222, pos0, pos11]

        const geo = new THREE.CylinderGeometry(0.005, 0.005, 1);
        for (let ri = 0; ri < 3; ri++) {
            for (let mi = 0; mi < 4; mi++) {
                const line = new THREE.Mesh(geo, mat);
                line.rotation.x = rotx[ri] * Math.PI / 2;
                line.rotation.z = rotz[ri] * Math.PI / 2;
                line.position.x = dx[ri][mi];
                line.position.y = dy[ri][mi];
                line.position.z = dz[ri][mi];
                lines.add(line);
            }
        }

        return lines;
    })();
    cube.add(lines);

    return cube;
}


// cylinder
function createCylinder() {
    const container = new THREE.Group();

    const clylinder = (function () {
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide });
        const geo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, undefined, true);
        return new THREE.Mesh(geo, mat);
    })();
    container.add(clylinder);

    const circles = (function () {
        const colors = [0x00ff00, 0xff00ff];
        const geo = new THREE.CircleGeometry(0.5, 32);

        return [0, 1].map(i => {
            const c = new THREE.Mesh(geo,
                new THREE.MeshBasicMaterial({ color: colors[i], transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
            c.position.y = [0.5, -0.5][i];
            c.rotation.x = Math.PI / 2;
            return c;
        });
    })();
    for (const c of circles) { container.add(c) };

    // line
    const toruses = (function () {
        const geo = new THREE.TorusGeometry(0.5, 0.005, 8, 32);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const t1 = new THREE.Mesh(geo, mat);
        t1.rotation.x = Math.PI / 2;
        t1.position.y = 0.5;
        const t2 = new THREE.Mesh(geo, mat);
        t2.rotation.x = Math.PI / 2;
        t2.position.y = -0.5;
        return [t1, t2]
    })();
    for (const t of toruses) { container.add(t) }
    return container;
}

function createFloor(gSize) {
    const floorContainer = new THREE.Object3D();
    const gridFloor = new THREE.GridHelper(gSize, gSize);
    floorContainer.add(gridFloor);

    const planeGeo1 = new THREE.PlaneGeometry(1, 1);
    const matPlane1 = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
    const plane1 = new THREE.Mesh(planeGeo1, matPlane1);
    plane1.rotation.x = Math.PI * 90 / 180;
    // floorContainer.add(plane1);
    floorContainer.position.y -= 1;
    return floorContainer;
}



// // [[0, 0, -L], [0, 0, L]]
// function makeCubeLines() {
//     const l = 0.5;
//     const L = 10000;
//     const points = [];
//     function bit2point(b) {
//         return (b + 8).toString(2).slice(1).split("").map(s => parseInt(s));
//     }
//     // 000 ~ 111
//     for (let i = 0; i < 8; i++) {
//         for (let k = 0; k < 3; k++) {
//             const i2 = i ^ (1 << k);
//             if (i < i2) {
//                 let b1 = bit2point(i);
//                 let b2 = bit2point(i2);
//                 b1 = b1.map(v => v - l);
//                 b2 = b2.map(v => v - l);
//                 b1[2 - k] -= L;
//                 b2[2 - k] += L;
//                 points.push([b1, b2]);
//             }
//         }
//     }
//     return points;
// }

