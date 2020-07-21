<template>
    <router-view />
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
  font-family: "Montserrat", sans-serif;
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
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #f5f5f559;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #f5f5f59e;
}
</style>
