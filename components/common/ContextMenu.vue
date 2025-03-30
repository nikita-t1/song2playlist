<template>
    <div
        @contextmenu.prevent="handleContextMenu"
        class="relative">
        <slot/>

        <!-- Context menu -->
        <div
            v-if="isVisible"
            ref="menu"
            :class="['fixed z-50 bg-white shadow rounded-lg border', { hidden: !isVisible }]"
            :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }">
            <div class="bg-spotify-black shadow-2xl border-2 border-spotify-green rounded-lg">
                <div
                    v-for="item in items"
                    :key="item.label"
                    @click="handleAction(item.command)"
                    class="flex hover:bg-spotify-green-darkest duration-100 py-2 px-4 pr-8 m-2 rounded-lg text-white">
                    <Icon :name="item.icon" :size="'20'" class="text-white"/>
                    <span class="ml-4 grow">{{ item.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const menuStore = useContextMenuStore();

type ContextMenuItem = {
    label: string;
    icon: string;
    command: Function;
};

// Props
const props = defineProps({
    items: {
        type: Array<ContextMenuItem>,
        required: true,
        // Example: [{ label: "Reload", icon: "ph:refresh", action: () => alert("Reload clicked!") }]
    },
    id: {
        type: String,
        required: true, // Pass a unique ID for each menu when using it
    },

});

// Reference for the menu DOM element
const menuRef = useTemplateRef<HTMLElement>('menu')

// Reactive state for menu
const isVisible = ref(false);
const menuPosition = ref({x: 0, y: 0});
const {x: mouseX, y: mouseY} = useMouse(); // Track mouse position


// Open the context menu
function handleContextMenu(event: any) {
    event.preventDefault();


    // Close all other menus by setting this menu as active
    menuStore.setActiveContextMenu(props.id);

    // Open this menu at the mouse position
    menuPosition.value = {x: mouseX.value, y: mouseY.value};
    isVisible.value = true;

    onClickOutside(menuRef, closeMenu)

    // Get screen width and set position dynamically
    const menuWidth = menuRef.value?.offsetWidth || 200; // Default width
    const screenWidth = window.innerWidth;

    const position = {
        x: mouseX.value,
        y: mouseY.value,
    };

    // If the menu overflows off the screen to the right, open it to the left
    if (mouseX.value + menuWidth > screenWidth) {
        position.x = mouseX.value - menuWidth;
    }

    menuPosition.value = position;

}

// Function to handle menu actions
function handleAction(action: Function | undefined) {
    if (action) action(); // Execute the action
    closeMenu(); // Close the menu after the action
}

// Close the context menu
function closeMenu() {
    isVisible.value = false;
    menuStore.closeContextMenu();
}


// Automatically close if this menu is no longer the active one
watch(
    () => menuStore.activeMenu,
    (newActiveMenu) => {
        isVisible.value = newActiveMenu === props.id;
    }
);

</script>
