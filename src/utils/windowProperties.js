
 import Vue from "vue";
 import debounce  from "lodash/debounce";

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

    this.debouncedResize =  debounce(this.onResize, 20);
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