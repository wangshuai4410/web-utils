/* eslint-disable */

//基础库
function Jr(args) {
  //创建一个数组，用来保存获取的节点或节点数组
  this.elements = [];
  //当参数是一个字符串，说明是常规css选择器，不是this,或者function
  if (typeof args == 'string') {
    //css模拟，就是跟CSS后代选择器一样
    if (args.indexOf(' ') != -1) {
      //把节点拆分开并保存在数组里
      var elements = args.split(' ');
      //存放临时节点对象的数组，解决被覆盖问题
      var childElements = [];
      var node = []; //用来存放父节点用的
      for (var i = 0; i < elements.length; i++) {
        //如果默认没有父节点，就指定document
        if (node.length == 0) node.push(document);
        switch (elements[i].charAt(0)) {
          //id
          case '#':
            //先清空临时节点数组
            childElements = [];
            childElements.push(this.getId(elements[i].substring(1)));
            node = childElements; //保存到父节点
            break;
          //类
          case '.':
            childElements = [];
            //遍历父节点数组，匹配符合className的所有节点
            for (var j = 0; j < node.length; j++) {
              var temps = this.getClass(elements[i].substring(1), node[j]);
              for (var k = 0; k < temps.length; k++) {
                childElements.push(temps[k]);
              }
            }
            node = childElements;
            break;
          //标签
          default:
            childElements = [];
            for (var j = 0; j < node.length; j++) {
              var temps = this.getTagName(elements[i], node[j]);
              for (var k = 0; k < temps.length; k++) {
                childElements.push(temps[k]);
              }
            }
            node = childElements;
        }
      }
      this.elements = childElements;
    } else {
      //find模拟,就是说只是单一的选择器
      switch (args.charAt(0)) {
        case '#':
          this.elements.push(this.getId(args.substring(1)));
          break;
        case '.':
          this.elements = this.getClass(args.substring(1));
          break;
        default:
          this.elements = this.getTagName(args);
      }
    }
  } else if (typeof args == 'Object') {
    if (args != undefined) {
      this.elements[0] = args;
    }
  }
}


Jr.prototype.getId = function (id) {
  return document.getElementById(id);
}
//获取CLASS节点数组
Jr.prototype.getClass = function (className, parentNode) {
  var node = null; //存放父节点
  var temps = [];
  if (parentNode != undefined) { //存在父节点时
    node = parentNode;
  } else { //不存在则默认document
    node = document;
  }
  var all = node.getElementsByTagName('*');
  for (var i = 0; i < all.length; i++) {
    //遍历所有节点，判断是否有包含className
    if ((new RegExp('(\\s|^)' + className + '(\\s|$)')).test(all[i].className)) {
      temps.push(all[i]);
    }
  }
  return temps;
}
//获取元素节点数组
Jr.prototype.getTagName = function (tag, parentNode) {
  var node = null; //存放父节点
  var temps = [];
  if (parentNode != undefined) {
    node = parentNode;
  } else {
    node = document;
  }
  var tags = node.getElementsByTagName(tag);
  for (var i = 0; i < tags.length; i++) {
    temps.push(tags[i]);
  }
  return temps;
}

const Sizzle = function (args) {
  return new Jr(args);
}
export default Sizzle;
