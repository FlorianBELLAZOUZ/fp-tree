var _ = require('lodash')

// map :: Tag:String => Object => Function => Object
var map = tag => object => func =>{
  object = _.cloneDeep(object)

  var _map = c=>{
    c = func(c)
    if(c[tag]) _recursive(c)
    return c
  }

  var _recursive = obj=>{
    obj[tag] = obj[tag].map(_map)
    return obj
  }

  return _recursive(object)
}

// forEach :: Tag:String => Object => Function => Undefined
var forEach = tag =>object =>func=>{
  var _each = c=>{func(c);if(c[tag]) _recursive(c);}
  var _recursive = obj=>obj[tag].forEach(_each)
  _recursive(object)
}

// reduce :: Tag:String => Object => Function => initial => *
var reduce = tag => object => func => initial => {
  var out = initial
  var reduce = child =>out = func(out)(child)
  forEach(tag)(object)(reduce)
  return out
}

// filter :: tag:String => Object => Function => Array
var filter = tag => object => func => {
  var test = array=>child=>{
    if(func(child)) array.push(child)
    return array
  }
  return reduce(tag)(object)(test)([])
}

// query :: name:String => Object => Array
var query = object=>name=>{
  var query = name.trim().replace(/ +/,' ').split(' ')
  return query.reduce((children, name)=>{
    var regExp = new RegExp('\\b'+name+'\\b')
    var test = child=>child.name?child.name.match(regExp):false
    children = children.filter(child=>'children' in child)
    return _.uniq(filter('children')({children})(test))
  },object.children)
}

module.exports = {
  map,
  forEach,
  reduce,
  filter,
  query
}
