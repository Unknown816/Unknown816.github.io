document.addEventListener('DOMContentLoaded', function() {
  function setGiscusTheme(theme) {
    var giscus = document.querySelector('iframe.giscus-frame');
    if (giscus) {
      var giscusTheme = theme === 'dark' ? window.GiscusThemeDark : window.GiscusThemeLight;
      const message = {
        setConfig: {
          theme: giscusTheme,
        }
      };
      giscus.style.cssText = giscus.style.cssText.replace('color-scheme: normal;', '');
      giscus.contentWindow.postMessage({ 'giscus': message }, 'https://giscus.app'); 
    }
  }

  // Initial theme setting
  var initialTheme = document.documentElement.getAttribute('data-user-color-scheme');
  setGiscusTheme(initialTheme);

  // Listen for changes to the 'data-user-color-scheme' attribute
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-user-color-scheme') {
        var newTheme = document.documentElement.getAttribute('data-user-color-scheme');
        setGiscusTheme(newTheme);
      }
    });
  });

  // Observe changes in the attribute
  observer.observe(document.documentElement, {
    attributes: true
  });
});
