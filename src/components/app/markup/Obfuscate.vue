
<script>
// const letters = "1234567890abcdefghijklmnopqrstuvwxyz~!@#$%^&*()-=_+{}[]"

export default {
  props: ["text"],
  data: () => ({
    content: "sdf",
	interval: null,
	letters: "dajkwdnawjkdnwajkdnwakndwjwdk"

  }),
  methods: {
    obfuscateText(text, offset = 0) {
      return [...text]
        .map(
          (ch, i) =>
            this.letters[
              (ch.charCodeAt(0) +
                Math.floor(Math.random() * 10) +
                offset +
                i * i) %
                this.letters.length
            ]
        )
        .join("");
    }
  },
  watch: {
	  text() {
		  console.log("update")
	  }
  },
  mounted() {
	this.content = this.text[0];
	// console.log(this.text)
    this.content = this.obfuscateText(this.content);
    setInterval(() => {
      this.content = this.obfuscateText(this.content);
    }, 200);
  },
  render() {
    this.text[0] = this.content;
    const owo = this.$createElement("span", this.text);
    return owo;
  }
};
</script>