exports.isMobile = () => {
  // if we want a more complete list use this: http://detectmobilebrowsers.com/
  // str.test() is more efficent than str.match()
  // remember str.test is case sensitive
  var isMobile = /iphone|ipod|android|ie|blackberry|fennec/.test(
    navigator.userAgent.toLowerCase()
  );
  return isMobile;
};
