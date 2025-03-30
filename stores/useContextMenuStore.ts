export const useContextMenuStore = defineStore('contextMenuStore', () => {

    const activeState = ref<boolean>(false)
    const activeMenu = ref<string | null>(null)

    function setActiveContextMenu(menu: string) {
        activeMenu.value = menu
        activeState.value = true
    }

    function closeContextMenu() {
        activeState.value = false
        activeMenu.value = null
    }

    return {
        activeState,
        activeMenu,
        setActiveContextMenu,
        closeContextMenu
    }
} )
