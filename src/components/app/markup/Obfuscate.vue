<template>
	<span ref="root"><slot></slot></span>
</template>

<script>
	// const letters = "1234567890abcdefghijklmnopqrstuvwxyz~!@#$%^&*()-=_+{}[]"

	export default {
		props: ["member"],
		data: () => ({
			interval: null,
		}),
		methods: {
			openUserInfo: function() {
				this.$store.dispatch('setUserInformationPopout', this.member.uniqueID)
			},
			obfuscateChildren: function() {
				const nodes = document.createTreeWalker(this.$refs.root, NodeFilter.SHOW_TEXT)
				let node
				while((node = nodes.nextNode()) != null) {
					// node.nodeValue = [...node.textContent].map(i => letters[(i.charCodeAt(0)+Math.floor(this.interval))%letters.length]).join("")
					node.nodeValue = `[...node.textContent].map(i => letters[(i.charCodeAt(0)+Math.floor(this.interval))%letters.length]).join("")`
					// this.append(node)
					this.$refs.root = "dajkwdnawjkdnwajkdnwakndwjwdk"
				}
			},
			update: function() {
				this.obfuscateChildren()
			},
			mounted: function() {
				this.resetInterval()
			},
			resetInterval: function() {
				clearInterval(this.interval)
				this.interval = setInterval(() => {
					this.obfuscateChildren()
				}, 200)
			}
		}
	}
</script>