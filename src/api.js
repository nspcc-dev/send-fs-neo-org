const server = process.env.REACT_APP_NEOFS;

async function serverRequest(method, url, params, headers) {
	const json = {
		method,
		headers,
	}

	if (json['headers']['Content-Type'] === 'multipart/form-data') {
		json['body'] = params;
		delete json['headers']['Content-Type'];
	} else if (Object.keys(params).length > 0) {
		json['body'] = JSON.stringify(params);
		json['headers']['Content-Type'] = 'application/json';
	}

	let activeUrl = url;
	if (server) {
		activeUrl = `${server}${url}`;
	}

	return fetch(activeUrl, json).catch((error) => {
		console.log(error);
	});
}

export default function api(method, url, params = {}, headers = {}) {
	return new Promise((resolve, reject) => {
		serverRequest(method, url, params, headers).then(async (response) => {
			if (response && response.status === 204) {
				resolve({ status: 'success' });
			} else {
				let res = response;
				if (method === 'HEAD') {
					resolve({
						'filename:': response.headers ? response.headers.get('X-Attribute-Filename') : '',
						'containerId': response.headers ? response.headers.get('X-Container-Id') : '',
						'ownerId': response.headers ? response.headers.get('X-Owner-Id') : '',
					});
				} else if (method === 'GET' && url.indexOf(`/gate/get/`) !== -1) {
					res = await response.blob();
					resolve(res);
				} else if (response && response.status === 200) {
					res = await response.json();
					resolve(res);
				} else {
					reject(res);
				}
			}
		});
	});
}
