window.addEventListener('DOMContentLoaded', init);

function init() {
    const [input_range_x, input_text_x, input_range_y, input_text_y,
        input_range_z, input_text_z,
        input_range_theta, input_text_theta] = [
            'input_range_x', 'input_text_x', 'input_range_y', 'input_text_y',
            'input_range_z', 'input_text_z',
            'input_range_theta', 'input_text_theta'
        ].map(id => document.getElementById(id))

    const width = window.innerWidth - 10; // 400;
    const height = window.innerHeight / 2;

    [input_range_x, input_range_y, input_range_z, input_range_theta].map(e => {
        e.style.width = `${width - 150}px`
    });

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas')
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    const scene = new THREE.Scene();

    var cameraIsPerspective = true;
    var theta = 45;
    var xrot = 0;
    var yrot = 0;
    var zrot = 0;

    // camera
    const S = 2;
    const { camera, oCamera } = (function () {
        const camera = new THREE.PerspectiveCamera(theta, width / height);
        camera.position.set(0, 0, 5);
        // camera.fov = 15;
        const oCamera = new THREE.OrthographicCamera(-S * width / height, S * width / height, (S), (-S));
        // width / - 2, width / 2, height / 2, height / - 2);
        oCamera.position.set(0, 0, 5);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        oCamera.lookAt(new THREE.Vector3(0, 0, 0));
        return { camera, oCamera }
    })();

    // floor
    const floorContainer = createFloor(101);
    scene.add(floorContainer);

    // container
    const container = createCube();
    scene.add(container);

    function render() {
        const d = S / Math.tan(theta * Math.PI / 360);
        console.log({ xrot, yrot, zrot, theta, d });
        container.rotation.x = xrot * Math.PI / 180;
        container.rotation.y = yrot * Math.PI / 180;
        container.rotation.z = zrot * Math.PI / 180;
        if (cameraIsPerspective) {
            camera.fov = theta;
            camera.updateProjectionMatrix();
            camera.position.set(0, 0, d);
            renderer.render(scene, camera);
        } else {
            renderer.render(scene, oCamera);
        }
        // calcPos();
    }

    function setTheta(value) {
        if (value != 0) {
            theta = value;
            cameraIsPerspective = true;
        } else {
            theta = 0;
            cameraIsPerspective = false;
        }
        console.log(value, cameraIsPerspective);
    }
    function setValue() {
        input_range_x.value = xrot;
        input_text_x.value = xrot;
        input_range_y.value = yrot;
        input_text_y.value = yrot;
        input_range_z.value = zrot;
        input_text_z.value = zrot;
        input_range_theta.value = theta;
        input_text_theta.value = cameraIsPerspective ? theta : '平行投影';
    }
    /*
                function calcPos() {
                    const worldPosition = box.getWorldPosition(new THREE.Vector3());
                    const projection = worldPosition.project(camera);
                    const sx = (width / 2) * (+projection.x + 1.0);
                    const sy = (height / 2) * (-projection.y + 1.0);
                }
    */

    input_range_x.addEventListener('input', (e) => { xrot = e.target.value; setValue(); render(); });
    input_text_x.addEventListener('change', (e) => { xrot = e.target.value; setValue(); render(); });
    input_range_y.addEventListener('input', (e) => { yrot = e.target.value; setValue(); render(); });
    input_text_y.addEventListener('change', (e) => { yrot = e.target.value; setValue(); render(); });
    input_range_z.addEventListener('input', (e) => { zrot = e.target.value; setValue(); render(); });
    input_text_z.addEventListener('change', (e) => { zrot = e.target.value; setValue(); render(); });
    input_range_theta.addEventListener('input', (e) => { setTheta(e.target.value); setValue(); render(); });
    input_text_theta.addEventListener('change', (e) => { setTheta(e.target.value); setValue(); render(); });
    /*
    input_button_camera.addEventListener('click', (e) => {
        cameraIsPerspective = !cameraIsPerspective; setValue(); render();
    });*/
    setValue();
    render();
}