<template>
  <div id="app">
    <router-view />
  </div>
</template>




<style>

html {
  height: 100%;
}

body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #383838;
  height: 100%;
}
/* ------- SCROLL BAR -------*/
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #8080806b;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #f5f5f559;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #f5f5f59e;
  border-radius: 10px;
}
</style>
