import { defineStore } from "pinia";
import { Platform, Dark } from "quasar";

export const useState = defineStore("state", {
  state: () => ({
    search: "",
    fabPosition: JSON.parse(localStorage.getItem("fabPosition")) || [70, 70],
    isGridStyle: Platform.is.mobile
      ? false : JSON.parse(localStorage.getItem("isGridStyle"))
        ? JSON.parse(localStorage.getItem("isGridStyle"))
        : true,
    isDarkTheme: JSON.parse(localStorage.getItem("isDarkTheme")) || false, // Switching and saving the theme takes place in the main layot
    drawer: JSON.parse(localStorage.getItem("drawer")) || false, // Used for the mobile version of the menu
    miniState: JSON.parse(localStorage.getItem("miniState")) || false, // Used for the desktop version of the menu
    activeTab: "common",
  }),

  actions: {
    importData(dataObject) {
      this.search = dataObject.search;
      this.fabPosition = dataObject.fabPosition;
      this.isGridStyle = dataObject.isGridStyle;
      this.isDarkTheme = dataObject.isDarkTheme;
      this.drawer = dataObject.drawer;
      this.miniState = dataObject.miniState;
      this.activeTab = dataObject.activeTab;

      localStorage.setItem("isGridStyle", this.isGridStyle);
      localStorage.setItem("miniState", this.miniState);
      localStorage.setItem("fabPosition", JSON.stringify(this.fabPosition));
    },

    toggleViewStyle() {
      this.isGridStyle = !this.isGridStyle;
      localStorage.setItem("isGridStyle", this.isGridStyle);
    },

    toggleMiniState(e) {
      this.miniState = !this.miniState;
      localStorage.setItem("miniState", this.miniState);
    },

    setActiveTab(tabName) {
      this.activeTab = tabName;
    },

    resetFabPosition() {
      this.fabPosition = [70, 70];
      localStorage.setItem("fabPosition", JSON.stringify(this.fabPosition));
    },

    toggleDrawer() {
      this.drawer = !this.drawer;
    },
  },

  getters: {
    getExportStateData: (state) => ({
      search: state.search,
      fabPosition: state.fabPosition,
      isGridStyle: state.isGridStyle,
      isDarkTheme: state.isDarkTheme,
      miniState: state.miniState,
      activeTab: state.activeTab,
      drawer: state.drawer,
    })
  }
});
