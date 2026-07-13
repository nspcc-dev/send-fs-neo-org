/// <reference types="vite/client" />
const server = import.meta.env.VITE_NEOFS;

type Methods = "GET" | "POST" | "HEAD";

export interface ObjectData {
	objectId?: string | null
	containerId?: string | null
	ownerId?: string | null
	filename?: string | null
	contentType?: string | null
	size?: string | null
	expirationEpoch?: string | null
}

export function attributesToBase64(attributes: object): string {
	const bytes: Uint8Array = new TextEncoder().encode(JSON.stringify(attributes));
	let binary: string = '';
	bytes.forEach((byte: number) => {
		binary += String.fromCharCode(byte);
	});
	return btoa(binary);
}

export function base64ToAttributes(value: string): any {
	const bytes: Uint8Array = Uint8Array.from(atob(value), (char: string) => char.charCodeAt(0));
	return JSON.parse(new TextDecoder().decode(bytes));
}

function readAttributes(headers: any): any {
	if (headers.get('X-Attributes-Base64')) {
		return base64ToAttributes(headers.get('X-Attributes-Base64'));
	}
	return headers.get('X-Attributes') ? JSON.parse(headers.get('X-Attributes')) : {};
}

async function serverRequest(method: Methods, url: string, params: object, headers: any) {
	const json: any = {
		method,
		headers,
	}

	if (json['headers']['Content-Type']) {
		json['body'] = params;
	} else if (Object.keys(params).length > 0) {
		json['body'] = JSON.stringify(params);
		json['headers']['Content-Type'] = 'application/json';
	}

	let activeUrl: string = url;
	if (server) {
		activeUrl = `${server}${url}`;
	}

	return fetch(activeUrl, json).catch((error: any) => {
		console.log(error);
	});
}

export default function api(method: Methods, url: string, params: object = {}, headers: object = {}) {
	return new Promise((resolve, reject) => {
		serverRequest(method, url, params, headers).then(async (response: any) => {
			if (response && response.status === 204) {
				resolve({ status: 'success' });
			} else {
				let res: any = response;
				if (method === 'HEAD' && response.status !== 200) {
					reject(res);
				} else if (method === 'HEAD' && response.headers) {
					const attributes: any = readAttributes(response.headers);
					const res: ObjectData = {
						'filename': attributes['FileName'],
						'contentType': response.headers.get('Content-Type'),
						'containerId': response.headers.get('X-Container-Id'),
						'ownerId': response.headers.get('X-Owner-Id'),
						'size': response.headers.get('Content-Length') ? response.headers.get('Content-Length') : response.headers.get('x-neofs-payload-length'),
						'expirationEpoch': attributes['__NEOFS__EXPIRATION_EPOCH'],
					}
					resolve(res);
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
