
<script>
// const letters = "1234567890abcdefghijklmnopqrstuvwxyz~!@#$%^&*()-=_+{}[]"

export default {
  props: ["text"],
  data: () => ({
    content: null,
	interval: null,
	letters: "1234567890abcdefghijklmnopqrstuvwxyz~!@#$%^&*()-=_+{}[]"

  }),
  methods: {
    obfuscateText(text, offset = 0) {
      return [...text]
        .map(
          (ch, i) =>
            this.$createElement('div', {class: 'obfuscate'} ,this.letters[
              (ch.charCodeAt(0) +
                Math.floor(Math.random() * 10) +
                offset +
                i * i) %
                this.letters.length
            ])
        )
    }
  },
  mounted() {
	this.content = this.text[0];

	this.content = this.obfuscateText(this.text[0]);
	this.interval = setInterval(() => {
		this.content = this.obfuscateText(this.text[0]);
	}, 50);
  },
  beforeDestroy() {
	  clearInterval(this.interval);
  },
  render() {
    return this.$createElement("span", this.content);
  }
};
</script>

<style >
.obfuscate {
  display: inline-block;
  width: 9px;
  text-align: center;
}
</style>