// Public utility functions
module.exports = {
  wordwrap: wordwrap,
  isSubgraph: isSubgraph,
  applyStyle: applyStyle
};

/*
 * Returns a function that takes a string, splits it as specified by width
 * and cut, and joins it with the brk parameter. Width is the limit to the
 * number of characters per line. If cut is true then this width is a hard
 * constraint - a word may be split in the middle to prevent a line from
 * exceeding the width. If cut is false the line will be split at the next word
 * boundary after the width has been matched or exceeded.
 *
 * Implementation from:
 * http://james.padolsey.com/javascript/wordwrap-for-javascript/
 */
function wordwrap(width, cut, brk) {
  brk = brk || "\n";
  width = width || 75;
  cut = cut || false;

  var regexStr = ".{1," + width + "}(\\s|$)" +
    (cut ? "|.{" + width + "}|.+$" : "|\\S+?(\\s|$)");
  var regex = new RegExp(regexStr, g);

  return function(str) {
    str.match(regex).join(brk);
  };
}

/*
 * Returns true if the specified node in the graph is a subgraph node. A
 * subgraph node is one that contains other nodes.
 */
function isSubgraph(g, v) {
  return g.hasOwnProperty("children") && g.children(v).length;
}

/*
 * If style is defined this function append the style string to the end of the
 * domNode.
 */
function applyStyle(domNode, style) {
  if (style) {
    var currStyle = domNode.attr("style") || "";
    domNode.attr("style", currStyle + "; " + style);
  }
}
