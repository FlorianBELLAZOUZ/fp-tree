var tree = require('..')
var Should = require('chai').Should()

var object = {
  name:'main',
  children:[
    {
      name:'one',
      children:[
        {name:'oneOne',useLess:true},
        {name:'oneTwo',useLess:true},
      ]
    },
    {name:'two'},
    {
      name:'three',
      children:[
        {name:'threeOne'},
        {
          name:'threeTwo',
          children:[
            {name:'threeTwoOne'},
            {name:'threeTwoTwo'}
          ]
        },
      ]
    },
    {name:'four'}
  ]
}

const parentsExpected = [
  'main','one','one','main','main','three','three','threeTwo',
  'threeTwo','main',
]


describe('forEach :: tag:String => Object => Function => undefined',()=>{
  it('should call func in all children',()=>{
    var expected = ['one','oneOne','oneTwo','two','three','threeOne',
      'threeTwo','threeTwoOne','threeTwoTwo','four']
    var test = []
    var testFunc = child=>test.push(child.name)
    tree.forEach('children')(object)(testFunc)

    test.should.be.deep.equal(expected)
  })

  it('should return good parent to callback',()=>{
    let i = 0
    const testFunc = (el, p)=>p.name.should.be.equal(parentsExpected[i++])
    tree.forEach('children')(object)(testFunc)
  })
})

describe('map :: tag:String => Object => Function => Object',()=>{
  it('should call func in all children',()=>{
    var check = child=>{
      child.check = true
      return child
    }
    var obj = tree.map('children')(object)(check)

    var testFunc = child => child.check.should.be.equal(true)
    tree.forEach('children')(obj)(testFunc)
  })

  it('should return an object with the same structure',()=>{
    var obj = tree.map('children')(object)(id=>id)

    var expected = ['one','oneOne','oneTwo','two','three','threeOne',
      'threeTwo','threeTwoOne','threeTwoTwo','four']
    var test = []
    var testFunc = child=>test.push(child.name)
    tree.forEach('children')(object)(testFunc)

    test.should.be.deep.equal(expected)
  })

  it('should return an object with children name equal ok',()=>{
    var omit = child=>{
      child.name = 'ok'
      return child
    }
    var obj = tree.map('children')(object)(omit)

    var testFunc = child => child.name.should.be.equal('ok')
    tree.forEach('children')(obj)(testFunc)
  })

  it('should return good parent to callback',()=>{
    let i = 0
    const testFunc = (el, p)=>{
      p.name.should.be.equal(parentsExpected[i++])
      return el
    }
    tree.map('children')(object)(testFunc)
  })
})
