
<script>
// const letters = "1234567890abcdefghijklmnopqrstuvwxyz~!@#$%^&*()-=_+{}[]"

export default {
  props: ["text"],
  data: () => ({
    content: null,
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
  mounted() {
	this.content = this.text[0];

	this.content = this.obfuscateText(this.text[0]);
	this.interval = setInterval(() => {
		this.content = this.obfuscateText(this.text[0]);
	}, 200);
  },
  beforeDestroy() {
	  clearInterval(this.interval);
  },
  render() {
    return this.$createElement("span", this.content);
  }
};
</script>