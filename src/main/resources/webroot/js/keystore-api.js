var KeystoreAPI = {
	endpoint: '',
	//endpoint: "http://localhost:8080",
	
	keystorePost: function(_data,_success, _error){
		var identifier = _data.identifier;
		var uri=KeystoreAPI.endpoint+"/api/v0/keystore/"+identifier;
		$.ajax({
			url:uri,
			type:"POST",
			dataType:"json",
			data: JSON.stringify(_data),
			xhrFields: {
		       withCredentials: true
		    },
			success: function(result) {
				if (result.status == 'success') {
					_success(result.data);
				}
			}.bind(this),
			error: function(){
				console.log("fallo KeystoreAPI.keystore-post");
				_error();
			}.bind(this),
		});
	},

}