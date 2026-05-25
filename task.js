export class Task {
    constructor(name, completed = false, description = "Empty", dueDate = "Empty") {
        this.name = name;
        this.completed = completed;
        this.description = description;
        this.dueDate = dueDate;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    render(onUpdate, onDelete, onView) {
        const new_item = document.createElement("li");
        const new_item_check = document.createElement("input");
        const new_item_text = document.createElement("span");
        const delete_button = document.createElement("input");

        new_item_check.type = "checkbox";
        new_item_check.checked = this.completed;
        delete_button.type = "button";
        delete_button.value = "Delete";
        new_item_text.textContent = this.name;

        new_item_check.addEventListener("change", () => {
            this.toggleComplete();
            onUpdate();
        });

        new_item_check.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        new_item.addEventListener("click", () => {
            onView(this);
        });

        delete_button.addEventListener("click", (event) => {
            event.stopPropagation();
            new_item.remove();
            onUpdate();
            onDelete(this);
        });

        new_item.appendChild(new_item_check);
        new_item.appendChild(new_item_text);
        new_item.appendChild(delete_button);

        return new_item;
    }
}