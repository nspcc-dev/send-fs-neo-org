import { useState } from 'react';
import { Link } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from './api';
import {
	Content,
	Container,
	Section,
	Heading,
	Tile,
	Notification,
	Form,
	Button,
} from 'react-bulma-components';

function base64ToArrayBuffer(base64) {
	const bytes = new Uint8Array([0, 0, 0, 0]);
	const binary_string = base64;
	const len = binary_string.length;
	for (let i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes;
}

const Home = ({
	onModal,
	onScroll,
	onDownload,
	environment,
	user,
}) => {
	const [files, setFiles] = useState([]);
	const [dragActive, setDragActive] = useState(false);
	const [lifetimeData, setLifetimeData] = useState(2);
	const [isLoading, setLoading] = useState(false);
	const [isCopiedUrl, setCopiedUrl] = useState(false);
	const [isCopiedMetadata, setCopiedMetadata] = useState(false);
	const [isCopiedContainerId, setCopiedContainerId] = useState(false);
	const [isCopiedObjectId, setCopiedObjectId] = useState(false);
	const [uploadedObjects, setUploadedObjects] = useState([]);

	const handleFile = (file, index) => {
		if (index !== undefined) {
			setFiles((filesTemp) => filesTemp.filter((item, indexItem) => indexItem !== index));
		} else {
			document.querySelector('input').value = '';
			if (file === undefined) {
				return;
			}

			if (file.size > 50 * 1024 * 1024) {
				onModal('failed', 'Selected file is over 50Mb. We don\'t support such big files');
				return;
			}

			if (files.some((fileItem) => fileItem.name === file.name)) {
				onModal('failed', 'Selected file has already been added');
				return;
			}
			setFiles([...files, file]);
		}
	};

	const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
		if (!isLoading) {
			if (e.type === "dragenter" || e.type === "dragover") {
				setDragActive(true);
			} else if (e.type === "dragleave") {
				setDragActive(false);
			}
		}
	};

	const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
		if (!isLoading) {
			setDragActive(false);
			if (e.dataTransfer.files && e.dataTransfer.files[0]) {
				handleFile(e.dataTransfer.files[0]);
			}
		}
	};

	const onUpload = (e) => {
		if (files.length === 0) {
			onModal('failed', 'Select file to upload to NeoFS');
			return;
		}

		setLoading(true);
		api('POST', `/chain`, {
			"id":"1",
			"jsonrpc":"2.0",
			"method":"getstorage",
			"params":[
				environment.netmapContract,
				environment.epochLine,
			],
		}).then((res) => {
			if (res['result']) {
				const epoch_b64 = atob(res['result']);
				const epoch_bytes = base64ToArrayBuffer(epoch_b64);
				const dv2 = new DataView(epoch_bytes.buffer);
				const epoch = dv2.getUint32(0, true);

				files.forEach((file) => {
					const formData = new FormData();
					formData.append('file', file);
					onUploadFile(formData, file.name, epoch, lifetimeData);
				});
			} else {
				setLoading(false);
				onModal('failed', 'Something went wrong, try again');
			}
		}).catch(() => {
			setLoading(false);
			onModal('failed', 'Something went wrong, try again');
		});
    e.preventDefault();
	};

	const onUploadFile = (formData, filename, epoch, lifetime) => {
		document.cookie = `Bearer=${user.XBearer}; path=/gate/upload; expires=${new Date(Date.now() + 10 * 1000).toUTCString()}`;
		api('POST', '/gate/upload/', formData, {
			'X-Attribute-NEOFS-Expiration-Epoch': String(Number(epoch) + Number(lifetime)),
			'X-Attribute-email': user.XAttributeEmail,
			'Content-Type': 'multipart/form-data',
		}).then((res) => {
			res['filename'] = filename;
			setUploadedObjects((uploadedObjectsTemp) => [...uploadedObjectsTemp, res]);
			setFiles((files) => {
				const filesTemp = files.filter((item) => item.name !== filename);
				if (filesTemp.length === 0) {
					setLoading(false);
				}
				return filesTemp;
			});
		}).catch(() => {
			onModal('failed', 'Something went wrong while uploading file, try again');
		});
	};

  return (
		<Container>
			{user ? (
				<Section>
					<Tile kind="ancestor">
						<Tile kind="parent">
							<Tile
								kind="child"
								renderAs={Notification}
								color={"gray"}
							>
								<Heading weight="semibold" subtitle align="center">Send.NeoFS: HTTP-gate demo for distributed object storage</Heading>
								<Content>
									<p>Send.NeoFS is a simple example of integration with NeoFS network via HTTP protocol. It allows to store your files in decentralized network for the selected period of time and share them via generated link. Send.NeoFS should be used for NeoFS public test only.</p>
									<p>During the test, we are collecting network metrics and feedback from participants which will help to improve the developed system. Your feedback is important for us. Please, send it to <a href="mailto:testnet@nspcc.ru" style={{ textDecoration: 'underline' }}>testnet@nspcc.ru</a>.</p>
									<p>Please note that your e-mail will be added to the headers of the loaded object.</p>
								</Content>
							</Tile>
						</Tile>
					</Tile>
					<Tile kind="ancestor">
						<Tile kind="parent">
							<Tile
								kind="child"
								renderAs={Notification}
								color={"gray"}
							>
								<Form.Field
									onDragEnter={handleDrag}
									onDragLeave={handleDrag}
									onDragOver={handleDrag}
									onDrop={handleDrop}
								>
									<Form.InputFile
										label={dragActive ? "Drop the files here ..." : "Drag & Drop files or click to send up to 50Mb"}
										align="center"
										onChange={(e) => handleFile(e.target.files[0])}
										icon={<FontAwesomeIcon icon={['fas', 'plus']} style={{ fontSize: 30 }} />}
										style={isLoading ? { display: 'flex', pointerEvents: 'none' } : { display: 'flex' }}
										boxed
									/>
								</Form.Field>
								<Button.Group style={{ justifyContent: 'center', alignItems: 'end' }}>
									<Form.Field>
										<Form.Label>Select file(s) lifetime</Form.Label>
										<Form.Control>
											<Form.Select
												onChange={(e) => setLifetimeData(e.target.value)}
												value={lifetimeData}
												disabled={isLoading}
											>
												<option value="2">12 hours (2 epochs)</option>
												<option value="4">1 day (4 epochs)</option>
												<option value="8">2 days (8 epochs)</option>
												<option value="16">4 days (16 epochs)</option>
											</Form.Select>
										</Form.Control>
									</Form.Field>
									<Button
										color="primary"
										onClick={onUpload}
										style={{ margin: '0 0 0.75rem 2rem' }}
										disabled={files.length === 0 || isLoading}
									>
										{isLoading ? <FontAwesomeIcon icon={['fas', 'spinner']} spin /> : 'Upload'}
									</Button>
								</Button.Group>
								{files && files.map((fileItem, index) => (
									<Notification
										key={fileItem.name}
										color="primary"
									>
										{fileItem.name}
										{!isLoading && (
											<Button
												onClick={(e) => handleFile(e, index)}
												remove
											/>
										)}
									</Notification>
								))}
								{uploadedObjects && uploadedObjects.length > 0 && (
									<>
										<Heading weight="semibold" subtitle align="center" style={{ marginTop: '2rem' }}>
											Uploaded objects
										</Heading>
										{uploadedObjects.map((uploadedObject, index) => (
											<Notification
												key={uploadedObject.filename}
												className="uploaded_object"
												color="primary"
											>
												<div className="uploaded_object_group">
													<Heading size="6" subtitle>
														<a
															href={`${environment.server ? environment.server : ''}/gate/get/${uploadedObject.object_id}`}
															onClick={onScroll}
															style={{ textDecoration: 'underline' }}
															rel="noopener noreferrer"
														>
															{uploadedObject.filename}
														</a>
														<CopyToClipboard
															text={`${environment.server ? environment.server : document.location.origin}/gate/get/${uploadedObject.object_id}`}
															onCopy={() => {
																setCopiedUrl(true);
																setTimeout(() => {
																	setCopiedUrl(false);
																}, 700);
															}}
														>
															<div>
																<FontAwesomeIcon icon={['fas', 'copy']} />
																{isCopiedUrl && (
																	<div className="tooltip" style={{ top: '-125%', left: '-165%' }}>Copied!</div>
																)}
															</div>
														</CopyToClipboard>
														<div
															onClick={() => onDownload(uploadedObject.object_id, uploadedObject.filename)}
															style={{ lineHeight: 0 }}
														>
															<FontAwesomeIcon icon={['fas', 'download']} />
														</div>
													</Heading>
													<Heading size="6" subtitle>
														<Link
															to={`/load/${uploadedObject.object_id}`}
															onClick={onScroll}
															style={{ textDecoration: 'underline' }}
															rel="noopener noreferrer"
														>
															Metadata
														</Link>
														<CopyToClipboard
															text={`${document.location.origin}/load/${uploadedObject.object_id}`}
															onCopy={() => {
																setCopiedMetadata(true);
																setTimeout(() => {
																	setCopiedMetadata(false);
																}, 700);
															}}
														>
															<div>
																<FontAwesomeIcon icon={['fas', 'copy']} />
																{isCopiedMetadata && (
																	<div className="tooltip" style={{ top: '-125%', left: '-165%' }}>Copied!</div>
																)}
															</div>
														</CopyToClipboard>
													</Heading>
												</div>
												<Heading size="6" subtitle>
													{`Container ID: ${uploadedObject.container_id}`}
													<CopyToClipboard
														text={uploadedObject.container_id}
														onCopy={() => {
															setCopiedContainerId(true);
															setTimeout(() => {
																setCopiedContainerId(false);
															}, 700);
														}}
													>
														<div>
															<FontAwesomeIcon icon={['fas', 'copy']} />
															{isCopiedContainerId && (
																<div className="tooltip" style={{ top: '-125%', left: '-165%' }}>Copied!</div>
															)}
														</div>
													</CopyToClipboard>
												</Heading>
												<Heading size="6" subtitle>
													{`Object ID: ${uploadedObject.object_id}`}
													<CopyToClipboard
														text={uploadedObject.object_id}
														onCopy={() => {
															setCopiedObjectId(true);
															setTimeout(() => {
																setCopiedObjectId(false);
															}, 700);
														}}
													>
														<div>
															<FontAwesomeIcon icon={['fas', 'copy']} />
															{isCopiedObjectId && (
																<div className="tooltip" style={{ top: '-125%', left: '-165%' }}>Copied!</div>
															)}
														</div>
													</CopyToClipboard>
												</Heading>
											</Notification>
										))}
									</>
								)}
							</Tile>
						</Tile>
					</Tile>
				</Section>
			) : (
				<Section>
					<Tile kind="ancestor">
						<Tile kind="parent">
							<Tile
								kind="child"
								renderAs={Notification}
								color={"gray"}
							>
								<Heading weight="semibold" subtitle align="center">Sign in with Google or GitHub account</Heading>
								<Button.Group style={{ justifyContent: 'center' }}>
									<Button
										renderAs="a"
										href="/signup_google"
										color="primary"
										style={{ paddingLeft: '2.5rem', minWidth: 240 }}
									>
										<FontAwesomeIcon
											icon={['fab', 'google']}
											style={{
												position: 'absolute',
												left: 0,
												padding: 12,
											}}
										/>
										<span>Continue with Google</span>
									</Button>
								</Button.Group>
								<Button.Group style={{ justifyContent: 'center' }}>
									<Button
										renderAs="a"
										href="/signup_github"
										color="primary"
										style={{ paddingLeft: '2.5rem', minWidth: 240 }}
									>
										<FontAwesomeIcon
											icon={['fab', 'github']}
											style={{
												position: 'absolute',
												left: 0,
												padding: 12,
											}}
										/>
										<span>Continue with GitHub</span>
									</Button>
								</Button.Group>
							</Tile>
						</Tile>
					</Tile>
				</Section>
			)}
		</Container>
  );
}

export default Home;
