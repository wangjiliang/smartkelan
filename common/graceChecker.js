
module.exports = {
	error:'',
	check : function (checkType,rule,data){
		for(var i = 0; i < rule.length; i++){
			switch (checkType){
				// 手机号
				case 'phone':
					var reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
					if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
				break;
				// email
				case 'email':
					var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
					if (!reg.test(data[rule[i].name])) { this.error = rule[i].errorMsg; return false; }
				break;	
			}
		}
		return true;
	},
	isPhone : function(phoneNumber){
		!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phoneNumber)) ? uni.showToast({title: '请填写正确手机号码',icon:"none"}):uni.hideToast();
	},

	isNumber : function (checkVal){
		checkVal = Number(checkVal);
		if(checkVal == NaN){return false;}
		return true;
	}
}