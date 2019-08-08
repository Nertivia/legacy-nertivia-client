
 import Vue from "vue";
 import throttle  from "lodash/throttle";

 const WindowProperties  = new Vue({
   data () {
     return {
       resizeWidth: 0,
       resizeHeight: 0,
     }
   },
   created() {
    this.resizeWidth = window.innerWidth;
    this.resizeHeight = window.innerHeight;

    this.debouncedResize =  throttle(this.onResize, 70);
    window.addEventListener("resize", this.debouncedResize);

    
   },
   methods: {
     onResize() {
      this.resizeWidth = window.innerWidth;
      this.resizeHeight = window.innerHeight;
     }
   }
 })

 export default WindowProperties;