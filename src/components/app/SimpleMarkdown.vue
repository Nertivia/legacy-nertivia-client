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