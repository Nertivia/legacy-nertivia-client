const config = {
  devMode:true,
  breeMode: false,
  recaptcha: "",
  IP: [
    {
      domain: "http://api.localhost",
      socketIP: "localhost"
    },
    {
      domain: "https://api.supertiger.tk",
      socketIP: "https://nertivia.supertiger.tk"
    }
  ]
}

if (window.webpackHotUpdate) {
  config.devMode = true;
} else {
  config.devMode = false
}

if ( config.devMode ) {
  config.recaptcha = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
  config['domain'] = config.IP[0].domain;
  config['socketIP'] = config.IP[0].socketIP;

  if( config.breeMode ) {
    config['domain'] = config.IP[1].domain;
    config['socketIP'] = config.IP[1].socketIP;
  }
} else {
  config.recaptcha = "6Ld0EIwUAAAAALJNTa-1s63l-w_jHyCY6dFAVwKe";
  config['domain'] = config.IP[1].domain;
  config['socketIP'] = config.IP[1].socketIP;
}

export default config;