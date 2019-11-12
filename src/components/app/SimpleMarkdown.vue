<template>
	<div class="formatted-content" v-html="markdown">
	</div>
</template>

<script>
	import Vue from 'vue'
	import messageFormatter from '@/utils/messageFormatter'

	export default {
		props: {
			message: String,
			require: true
		},
		computed: {
			markdown: function() {
				return messageFormatter(this.message)
			}
		}
	}
</script>

<style>
	pre {
	  padding: 0;
	  margin: 0;
	}

	.codeblock {
	  background-color: rgba(0, 0, 0, 0.397);
	  padding: 5px;
	  border-radius: 5px;
	  word-wrap: break-word;
	  word-break: break-word;
	  white-space: pre-wrap;
	  overflow-wrap: anywhere;
	}

	.content-message img.emoji {
	  object-fit: contain;
	  height: 2em;
	  width: 2em;
	  margin: 1px;
	  vertical-align: -9px;
	}


	.inline-code {
		background: rgba(0, 0, 0, 0.322);
	}

	.link {
	  color: rgb(86, 159, 253);
	}
</style>