

const website = "http://1.71.248.146:38080/admin"
// const website = "http://192.168.10.3:8081/zvzcms"
const serviceModule = {
		www: website,
		url: website+'/api/json',
		upload: 'http://1.71.248.146:38080/wechat/alarm/appadd', //上传视频
        method: 'POST',
		data:{
			username:'admin',
			password:'admin@123'
		}
};


const ApiSetting = { ...serviceModule }
export default ApiSetting