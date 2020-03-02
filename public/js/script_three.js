// online editor: http://threejs.org/editor/
// git clone https://github.com/josdirksen/learning-threejs-third
// https://github.com/mrdoob/three.js
// https://github.com/mrdoob/stats.js
// https://github.com/dataarts/dat.gui

const sin = Math.sin;
const cos = Math.cos;
const tan = Math.tan;
const atan = Math.atan;
const PI = Math.PI;
const random = Math.random;
const max = Math.max;
const min = Math.min;

const R2D = 180 / PI;
const D2R = PI / 180;

let g_mouse = {};
function initThree() {
    log('initThree');
    // init variables
    let cameraX_o = -200;
    let cameraX_d = -400;
    let icosahedronY_o = 10;
    let icosahedronZ_o = 25;
    let fogFar = 1000;

    // g_winWidth = $(window).width();
    // g_winHeight = $(window).height();

    g_mouse.x = g_winWidth / 2;
    g_mouse.y = g_winHeight / 2;
    g_mouse.scrMax = $("body").prop("scrollHeight") - g_winHeight;

    // scene
    let scene = new THREE.Scene();
    scene.fog = new THREE.Fog(g_subColor0, 0, fogFar);

    // mesh icosahedron
    let geometry = new THREE.IcosahedronGeometry(10);
    let material = new THREE.MeshBasicMaterial({ color: g_mainColor0, wireframe: true });
    let icosahedron = new THREE.Mesh(geometry, material);
    icosahedron.position.set(0, icosahedronY_o, icosahedronZ_o);
    scene.add(icosahedron);

    // let geometry = new THREE.IcosahedronGeometry(10);
    // let materials = [
    //     new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
    //     new THREE.MeshBasicMaterial({ opacity: 0.5, color: 0x44ff44, transparent: true })
    // ];
    // let icosahedron = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);
    // scene.add(icosahedron);

    // camera
    // let fov_v_deg = 15;
    let fov_h = 30 * D2R;
    let fov_v_deg = 2 * atan(tan(fov_h / 2) * g_winHeight / g_winWidth) * R2D;
    let camera = new THREE.PerspectiveCamera(fov_v_deg, g_winWidth / g_winHeight, 0.1, fogFar);
    camera.position.set(cameraX_o + cameraX_d * g_scrollTop / g_mouse.scrMax, 0, 0);
    camera.lookAt(scene.position);

    // renderer
    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(g_subColor0));
    renderer.setSize(g_winWidth, g_winHeight);
    document.getElementById("webgl-output").appendChild(renderer.domElement);

    // util
    // let stats = initStats();
    // let trackballControls = initTrackballControls(camera, renderer);
    // let clock = new THREE.Clock();    

    let cnt = 0;
    let cnt_max = 10000;

    let ani = true;
    if (ani) renderScene();
    else renderer.render(scene, camera);

    function renderScene() {
        // util
        // stats.update();
        // trackballControls.update(clock.getDelta());

        // icosahedron rotation
        cnt++;
        if (cnt == cnt_max) cnt = 0;
        icosahedron.rotation.x = 2 * PI * cnt / cnt_max;
        icosahedron.rotation.y = 2 * PI * cnt / cnt_max * 2;
        icosahedron.rotation.z = 2 * PI * cnt / cnt_max * 3;

        // icosahedron position
        let x_in = -(g_mouse.y - g_winHeight / 2) / 50;
        let y_in = (g_mouse.x - g_winWidth / 2) / 50;
        let pos_i = { x: x_in, y: y_in };
        let pos_o = TrajFilter(pos_i);
        icosahedron.position.y = icosahedronY_o + pos_o.x;
        icosahedron.position.z = icosahedronZ_o + pos_o.y;
        camera.position.x = cameraX_o + cameraX_d * g_scrollTop / g_mouse.scrMax;

        // fog
        scene.fog.far = max(0, fogFar * (1 - 1.5 * g_scrollTop / g_winHeight));

        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    // a_v = 2*atan(tan(a_h/2) * g_winHeight / g_winWidth);
    // let fov = 15;
    // let fov_h = 15 * D2R;
    // let _dis = 
    // console.log()
    // let fov = 2 * atan(tan(fov_h / 2) * g_winHeight / g_winWidth) * R2D;


    // event handlers
    window.addEventListener('resize', function () {
        // g_winWidth = $(window).width();
        // g_winHeight = $(window).height();

        // let fov_v_deg = 15;
        let fov_v_deg = 2 * atan(tan(fov_h / 2) * g_winHeight / g_winWidth) * R2D;
        camera.aspect = g_winWidth / g_winHeight;
        camera.updateProjectionMatrix();
        camera.fov = fov_v_deg;

        renderer.setSize(g_winWidth, g_winHeight);
    }, false);

    document.addEventListener('mousemove', hMousemove, false);
}

function hMousemove(e) {
    g_mouse.x = e.x;
    g_mouse.y = e.y;
}

let pos_p = { x: 0, y: 0 };
function TrajFilter({ x, y }) {
    let gain = 0.02;
    let x_out = gain * x + (1 - gain) * pos_p.x;
    let y_out = gain * y + (1 - gain) * pos_p.y;
    pos_p = { x: x_out, y: y_out };
    return pos_p;
}

// function initStats(type) {
//     var panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? parseInt(type) : 0;
//     var stats = new Stats();
//     stats.showPanel(panelType); // 0: fps, 1: ms, 2: mb, 3+: custom
//     document.body.appendChild(stats.dom);
//     return stats;
// }