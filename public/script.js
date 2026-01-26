let currentFilter = 'pending';
const itemsdiv = document.getElementById("items");
const input = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
// Select the container for the input and button to hide it dynamically
const inputGroup = document.querySelector(".input-group");

// This will only run if we are on the Todo page
if (itemsdiv) {
    const renderItems = async () => {
        const res = await fetch('/api/todos');
        const items = await res.json();
        
        // DYNAMIC VISIBILITY: Only show "Add Item" when the filter is 'pending'
        if (inputGroup) {
            inputGroup.style.display = (currentFilter === 'pending') ? 'flex' : 'none';
        }

        itemsdiv.replaceChildren(); 

        items.filter(item => item.status === currentFilter).forEach(item => {
            const container = document.createElement("div");
            container.className = "item-row";

            const text = document.createElement("span");
            text.className = `item-text ${item.status === 'completed' ? 'completed-text' : ''}`;
            text.textContent = item.text;

            const btnGroup = document.createElement("div");
            btnGroup.className = "button-group";

            // Logic for buttons based on the current tab
            if (currentFilter === 'pending') {
                btnGroup.appendChild(createBtn("Done", "done-btn", () => updateStatus(item._id, 'completed')));
            } else if (currentFilter === 'completed') {
                btnGroup.appendChild(createBtn("Delete", "delete-btn", () => updateStatus(item._id, 'deleted')));
            } else {
                btnGroup.appendChild(createBtn("Restore", "done-btn", () => updateStatus(item._id, 'pending')));
                btnGroup.appendChild(createBtn("Purge", "delete-btn", () => purgeItem(item._id)));
            }

            container.append(text, btnGroup);
            itemsdiv.appendChild(container);
        });
    };

    const createBtn = (label, cls, fn) => {
        const b = document.createElement("button");
        b.textContent = label;
        b.className = cls;
        b.addEventListener('click', fn);
        return b;
    };

    const updateStatus = async (id, status) => {
        await fetch(`/api/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        renderItems();
    };

    const purgeItem = async (id) => {
        if (!confirm("Permanent delete? This cannot be undone.")) return;
        await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        renderItems();
    };

    if (addBtn) {
        addBtn.addEventListener('click', async () => {
            if (!input.value.trim()) return;
            await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: input.value })
            });
            input.value = "";
            renderItems();
        });
    }

    // Tab switching logic
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.status;
            renderItems();
        });
    });

    // Initial load
    renderItems();
}