class WxValidate {
  /**
   * @param rules 校验规则
   * 校验优先级 type > regex > validate
   * key: 字段名[{
   *    message:提示信息,
   *    type: '校验类型',
   *    regex: '正则',
   *    validate: '校验方法',
   * }
   * ]
   */
  constructor(rules){
    this.rules = rules
    this.__initDefaultsRegex()
    this.__initDefaultsMessage()
    this.__initDefaultsValidate()
  }
  __initDefaultsRegex(){
    this.defaultsRegex = {
      tel:/^1\d{10}$/,
      idcard:/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
    }
  }
  __initDefaultsMessage(){
    this.defaultMessage = {
      required: '这是必填字段。',
      tel: '请输入11位的手机号码。',
      idcard: '请输入18位的有效身份证。'
    }
  }
  __initDefaultsValidate(){
    this.defaultsValidate = {}
    for(const key in this.defaultsRegex){
      this.defaultsValidate[key] = (val) => this.defaultsRegex[key].test(val)
    }
  }

  /**
   * 判断输入值是否为空
   */
  isNotNull(value) {
    return value !== null && value !== undefined && value !== ''
  }

  isNull(value){
    return !this.isNotNull(value)
  }

  //校验表单
  checkForm(data){
    this.errorList = []
    for(const key in this.rules){
      this.checkFields(key, data[key], this.rules[key])
    }
    return this.errorList
  }

  /**
   * @param key 字段名
   * @param val 值
   * @param rules @type array 校验规则
   */
  checkFields(key, val, rules=[]){
    rules = Array.isArray(rules) ? rules : [rules]
    rules.forEach(rule => {
      this.checkField(key, val,rule)
    })
  }

  checkField(key, val, rule){
    rule = rule || {}
    let pass = true
    if(rule.required){
      pass = this.isNotNull(val)
    }else if(rule.type){
      pass = this.validateByType(val, rule.type)
    }else if(rule.regex){
      pass = this.validateByRegex(val, rule.regex)
    }else if(rule.validate){
      pass = this.validateByFn( val, rule.validate)
    }
    if(!pass){
      const message = this.getErrorMessage(rule)
      this.errorList.push({key, message, value: val})
    }
  }

  addValidateMethod(key, fn){
    if(this.defaultsValidate[key])throw new Error('此校验方法已存在')
    this.defaultsValidate[key] = fn
  }

  getErrorMessage(rule){
    if(rule.type){
      return rule.message || this.defaultMessage[rule.type]
    }
    return rule.message
  }
  // 根据类型校验
  validateByType(val, type){
    return this.isNull(val) || this.defaultsValidate[type](val)
  }
  //根据正则校验
  validateByRegex(val, regex){
    return regex.test(val)
  }
  // 根据自定义方法校验
  validateByFn( val, fn){
    return fn(val)
  }
}

module.exports = WxValidate
