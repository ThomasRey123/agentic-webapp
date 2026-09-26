// Run before the page paints so a saved choice is applied without a flash.
export const themeInitScript = `try{var theme=localStorage.getItem("theme");if(theme==="light"||theme==="dark")document.documentElement.dataset.theme=theme}catch(e){}`;
