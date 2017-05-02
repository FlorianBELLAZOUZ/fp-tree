var _ = require('lodash')

// map :: Tag:String => Object => Function => Object
var map = tag => object => func =>{
  object = _.cloneDeep(object)

  var _map = p=>c=>{
    c = func(c,p)
    if(c[tag]) _recursive(c)
    return c
  }

  var _recursive = obj=>{
    obj[tag] = obj[tag].map(_map(obj))
    return obj
  }

  return _recursive(object)
}

// forEach :: Tag:String => Object => Function => Undefined
var forEach = tag =>object =>func=>{
  var _each = p=>c=>{func(c,p);if(c[tag]) _recursive(c);}
  var _recursive = obj=>obj[tag].forEach(_each(obj))
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

// query :: tree:Object => name:String =>  => Array
var query = tree=>name=>queryKey('children')(tree)(name)

// queryOne :: tree:Object => name:String => Array
var queryOne = tree=>name=>query(tree)(name)[0]

var queryKey = key=>tree=>name=>{
  var query = name.trim().replace(/ +/,' ').split(' ')
  return query.reduce((children, name)=>{
    var regExp = new RegExp('\\b'+name+'\\b')
    var test = child=>child.name?child.name.match(regExp):false
    children = children.filter(child=>key in child)
    return _.uniq(filter(key)({[key]:children})(test))
  },tree[key])
}

module.exports = {
  map,
  forEach,
  reduce,
  filter,
  query,
  queryOne,
  queryKey,
}
