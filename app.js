import { initializeApp } from "firebase/app";
import { doc, getDocs, addDoc, updateDoc, getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDEToSo5Gzs1ORPI2-b3aV2ZchO56-UZWc",
    authDomain: "info-5146-pwa.firebaseapp.com",
    projectId: "info-5146-pwa",
    storageBucket: "info-5146-pwa.firebasestorage.app",
    messagingSenderId: "1054883632084",
    appId: "1:1054883632084:web:1082619cc012e7428afc41",
    measurementId: "G-ZCMKZZP6DE"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

const sw = new URL('service-worker.js', import.meta.url)
if ('serviceWorker' in navigator) {
    const s = navigator.serviceWorker;
    s.register(sw.href, {
        scope: '/'
    })

        .then(_ => console.log('Service Worker Registered for scope:', sw.href,
            'with', import.meta.url))
        .catch(err => console.error('Service Worker Error:', err));
}
// Add Task
addTaskBtn.addEventListener('click', async () => {
    const task = taskInput.value.trim();
    if (task) {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();

        if (taskText) {
            await addTaskToFirestore(taskText);
            renderTasks();
            taskInput.value = "";
        }
        renderTasks();
    }
});

async function addTaskToFirestore(taskText) {
    await addDoc(collection(db, "todos"), {
        text: taskText,
        completed: false
    });
}

//reterieving the to-do list from firestore when the app loads
async function renderTasks() {
    var tasks = await getTasksFromFirestore();
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        if (!task.data().completed) {
            const taskItem = document.createElement("li");
            taskItem.id = task.id;
            taskItem.textContent = task.data().text;
            taskList.appendChild(taskItem);
        }
    });
}

async function getTasksFromFirestore() {
    var data = await getDocs(collection(db, "todos"));
    let userData = [];
    data.forEach((doc) => {
        userData.push(doc);
    });
    return userData;
}
//sanitize input
function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
}
const taskText = sanitizeInput(taskInput.value.trim());
// Remove Task on Click
taskList.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
            e.target.remove();
    }
});