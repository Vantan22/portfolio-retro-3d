import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function BookScene3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeae0c8);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(8, 5, 8);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lights setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const ceilingLight = new THREE.PointLight(0xffcb77, 1);
    ceilingLight.position.set(0, 8, 0);
    ceilingLight.castShadow = true;
    scene.add(ceilingLight);

    // Room setup (giữ nguyên code phòng)
    // ... (giữ code tạo sàn, tường, bàn, đèn)

    // Load book models
    const loader = new GLTFLoader();
    const bookModels = [];
    const bookPositions = [];

    // Tạo giá sách với model
    const createBookshelf = (position) => {
      const shelfGroup = new THREE.Group();

      // Khung giá
      const frameGeometry = new THREE.BoxGeometry(3, 6, 0.5);
      const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x6d4c41 });
      const frame = new THREE.Mesh(frameGeometry, frameMaterial);
      frame.castShadow = true;
      shelfGroup.add(frame);

      // Các tầng giá
      for (let y = -2; y <= 2; y += 1) {
        const shelfGeometry = new THREE.BoxGeometry(3, 0.1, 0.5);
        const shelf = new THREE.Mesh(shelfGeometry, frameMaterial);
        shelf.position.y = y;
        shelf.castShadow = true;
        shelfGroup.add(shelf);

        // Vị trí cho sách trên mỗi tầng
        for (let x = -1; x <= 1; x += 0.4) {
          bookPositions.push({
            position: new THREE.Vector3(
              position[0] + x,
              position[1] + y + 0.45,
              position[2]
            ),
            rotation: new THREE.Euler(
              0,
              Math.random() * Math.PI * 0.1 - Math.PI * 0.05,
              0
            ),
          });
        }
      }

      shelfGroup.position.set(...position);
      return shelfGroup;
    };

    // Thêm giá sách
    const rightShelf = createBookshelf([6, 3, -6]);
    const centerShelf = createBookshelf([0, 3, -6]);
    scene.add(rightShelf, centerShelf);

    // Load và đặt sách
    const loadBook = (path, index) => {
      return new Promise((resolve) => {
        loader.load(path, (gltf) => {
          const model = gltf.scene;
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });

          // Scale model to appropriate size
          model.scale.set(0.2, 0.2, 0.2);

          // Position the book
          const pos = bookPositions[index % bookPositions.length];
          model.position.copy(pos.position);
          model.rotation.copy(pos.rotation);

          scene.add(model);
          bookModels.push(model);
          resolve();
        });
      });
    };

    // Load all books
    const bookPaths = [
      "/src/assets/model/scene.gltf",
      "/src/assets/model/scene.gltf",
      "/src/assets/model/scene.gltf",
      // Thêm đường dẫn đến các model sách khác
    ];

    Promise.all(bookPaths.map((path, index) => loadBook(path, index))).then(
      () => {
        console.log("All books loaded");
      }
    );

    // Person setup (giữ nguyên code người)
    // ... (giữ code tạo người)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 5;
    controls.maxDistance = 15;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate books slightly
      bookModels.forEach((book, index) => {
        book.rotation.y =
          Math.sin(Date.now() * 0.001 + index) * 0.02 +
          bookPositions[index % bookPositions.length].rotation.y;
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
}

export default BookScene3D;
