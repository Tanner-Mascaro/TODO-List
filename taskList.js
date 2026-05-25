import { Task } from './task.js';
import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

export class TaskList {
    constructor() {
        this.tasks = [];
        this.task_list = document.getElementById("task_list");
        this.totalspan = document.getElementById("total_completed");
    }

    async loadTasks() {
        try {
            const uid = auth.currentUser.uid;
            const querySnapshot = await getDocs(collection(db, "users", uid, "tasks"));

            this.tasks = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const task = new Task(data.name, data.completed, data.description, data.dueDate);
                task.id = doc.id;
                this.tasks.push(task);
            });

            this.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            this.renderTasks(this.tasks);

        } catch (error) {
            console.error("Could not load tasks:", error);
        }
    }

    renderTasks(tasks) {
        this.task_list.innerHTML = "";

        if (tasks.length === 0) {
            const empty_message = document.createElement("p");
            empty_message.textContent = "No tasks yet, add something!";
            this.task_list.appendChild(empty_message);
            return;
        }

        const grouped = tasks.reduce((groups, task) => {
            if (!groups[task.dueDate]) {
                groups[task.dueDate] = [];
            }
            groups[task.dueDate].push(task);
            return groups;
        }, {});

        Object.keys(grouped).forEach(date => {
            const date_header = document.createElement("h3");
            date_header.textContent = new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            this.task_list.appendChild(date_header);

            grouped[date].forEach(task => {
                this.task_list.appendChild(task.render(
                    this.updateCounter.bind(this),
                    async (deletedTask) => {
                        const uid = auth.currentUser.uid;
                        await deleteDoc(doc(db, "users", uid, "tasks", deletedTask.id));
                        this.tasks = this.tasks.filter(t => t !== deletedTask);
                        this.renderTasks(this.tasks);
                    },
                    (task) => this.openViewModal(task)
                ));
            });
        });
    }

    async addItem(name, description, dueDate) {
        if (name === "") return;

        const uid = auth.currentUser.uid;
        const taskData = {
            name: name,
            completed: false,
            description: description,
            dueDate: dueDate
        };

        const docRef = await addDoc(collection(db, "users", uid, "tasks"), taskData);
        const task = new Task(taskData.name, taskData.completed, taskData.description, taskData.dueDate);
        task.id = docRef.id;

        this.tasks.push(task);
        this.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        this.renderTasks(this.tasks);

        document.getElementById("modal").style.display = "none";
        document.body.classList.remove("modal_open");
    }

    updateCounter() {
        const counted = document.querySelectorAll("input[type='checkbox']:checked").length;
        this.totalspan.textContent = `Completed: ${counted}`;
    }

    searchList() {
        const searched = document.getElementById("search").value.toLowerCase();
        const found = this.tasks.filter(task => task.name.toLowerCase().includes(searched));

        if (found.length === 0) {
            this.task_list.innerHTML = "";
            const empty_message = document.createElement("p");
            empty_message.textContent = "No tasks match your search!";
            this.task_list.appendChild(empty_message);
            return;
        }

        this.renderTasks(found);
    }

    openCreateModal() {
        const modal = document.getElementById("modal");
        const modal_content = document.getElementById("modal_content");

        modal_content.innerHTML = "";

        const name_input = document.createElement("input");
        name_input.placeholder = "Task name...";

        const text_input = document.createElement("textarea");
        text_input.placeholder = "Task description...";

        const date = document.createElement("input");
        date.type = "date";

        const save_btn = document.createElement("button");
        save_btn.textContent = "Save";

        modal_content.appendChild(name_input);
        modal_content.appendChild(text_input);
        modal_content.appendChild(date);
        modal_content.appendChild(save_btn);

        modal.style.display = "block";
        document.body.classList.add("modal_open");

        save_btn.addEventListener("click", () => {
            this.addItem(name_input.value, text_input.value, date.value);
        });
    }

    openViewModal(task) {
        const modal = document.getElementById("modal");
        const modal_content = document.getElementById("modal_content");

        modal_content.innerHTML = "";

        const title = document.createElement("h2");
        title.textContent = task.name;

        const description = document.createElement("p");
        description.textContent = task.description;

        const dueDate = document.createElement("p");
        dueDate.textContent = new Date(task.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const close_btn = document.createElement("button");
        close_btn.textContent = "Close";
        close_btn.addEventListener("click", () => {
            modal.style.display = "none";
            document.body.classList.remove("modal_open");
        });

        modal_content.appendChild(title);
        modal_content.appendChild(description);
        modal_content.appendChild(dueDate);
        modal_content.appendChild(close_btn);

        modal.style.display = "block";
        document.body.classList.add("modal_open");
    }
}