import futoji from 'futoji'

export default  (message) => {
    message = escapeHtml(message)

    futoji.addTransformer({
        name: 'bold-and-italic', 
        symbol: '***',
        transformer: text => `<strong><em>${text}</em></strong>`
    })

    futoji.addTransformer({
        name: 'bold', 
        symbol: '**',
        transformer: text => `<strong>${text}</strong>`
    })
    
    futoji.addTransformer({
        name: 'italic', 
        symbol: '*',
        transformer: text => `<em>${text}</em>`
    })

    futoji.addTransformer({
        name: 'underline', 
        symbol: '__',
        transformer: text => `<u>${text}</u>`
    })
    futoji.addTransformer({
        name: 'italic', 
        symbol: '_',
        transformer: text => `<em>${text}</em>`
    })
    futoji.addTransformer({
        name: 'srike', 
        symbol: '~~',
        transformer: text => `<s>${text.trim()}</s>`
    })

    futoji.addTransformer({
        name: 'code-block', 
        symbol: '``\`',
        recursive: false,
        transformer: text => `<div class="codeblock"><code>${text.trim()}</code></div>`,
    })
    
    futoji.addTransformer({
        name: 'code', 
        symbol: '`',
        recursive: false,
        transformer: text => `<code>${text}</code>`,
    })
    return futoji.format(message);
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }