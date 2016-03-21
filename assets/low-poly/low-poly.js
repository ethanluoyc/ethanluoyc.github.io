function renderFig(origSrc, svgSrc, container) {
  container.css({overflow: "auto", position: "relative"});
  container.addClass("low-poly");
  var original = $("<div class='original'></div>");
  var originalImg = $("<img></img>")
  $(originalImg).attr("src", origSrc);
  original.append(originalImg);
  var spinner = $("<div class='spinner'><div class='double-bounce1'></div><div class='double-bounce2'></div></div>");
  var rendered = $("<div class='rendered'></div>");
  $.get(svgSrc, function(){
    container.append(spinner);
  })
    .then(function(xmlDoc) {
        spinner.hide();
        var svg = $(xmlDoc).find("svg")[0];
        var w = $(svg).attr("width");
        var h = $(svg).attr("height");
        if (navigator.userAgent.toLowerCase().indexOf('safari/') > -1) {
            $(svg).removeAttr("height");
        }; // TODO fix a bug that safari does not correctly calculate width;
        $(svg).attr("viewBox", "0 " + "0 " + w + " " + h); //so it adaptes to div size
        rendered.append(svg);
        container.append(original, rendered);
        var is_mobile = !!navigator.userAgent.match(/iphone|android|blackberry/ig) || false;
        if (is_mobile) {
            rendered.on("click", function(event){
                rendered.toggleClass("wireframe");
            });
        } else {
            rendered.hover(function(event){
                rendered.toggleClass("wireframe");
            });
        };

      });
};
