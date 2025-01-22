import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UploadedObject } from './App.tsx';
import api from './api.ts';
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

const Home = ({
	onModal,
	onScroll,
	onDownload,
	environment,
	uploadedObjects,
	setUploadedObjects,
	user,
}) => {
	const [files, setFiles] = useState<File[]>([]);
	const [dragActive, setDragActive] = useState<boolean>(false);
	const [lifetimeData, setLifetimeData] = useState<string>('12h');
	const [isLoading, setLoading] = useState<boolean>(false);
	const [isCopied, setCopy] = useState<boolean | string>(false);
	const fileUploadMbLimit: number = 200 * 1024 * 1024;

	const handleAllFiles = (files: any) => {
		const unsupportedFiles: any[] = [];
		for (let i = 0; i < files.length; i += 1) {
			if (['application/javascript', 'text/javascript', 'application/xhtml+xml', 'text/html', 'text/htmlh'].indexOf(files[i].type) === -1) {
				handleFile(files[i], i === (files.length - 1));
			} else {
				unsupportedFiles.push(files[i].name);
			}
		}

		if (unsupportedFiles.length > 0) {
			onModal('failed', `Selected file${unsupportedFiles.length > 1 ? 's' : ''} (${unsupportedFiles.join(', ')}) can't be uploaded because of type restrictions (HTML and JS are forbidden)`);
		}
	};

	const handleFile = (file: any, isClear: boolean = true, index?: number | undefined) => {
		if (index !== undefined) {
			setFiles((filesTemp: File[]) => filesTemp.filter((item: File, indexItem: number) => indexItem !== index));
		} else {
			if (isClear) {
				const inputElement: HTMLInputElement | null = document.querySelector('input');
				if (inputElement) {
					inputElement.value = '';
				}
			}

			if (file === undefined) {
				return;
			}

			if (file.size > fileUploadMbLimit) {
				onModal('failed', 'Selected file is over 200Mb. We don\'t support such big files');
				return;
			}

			if (files.some((fileItem: File) => fileItem.name === file.name)) {
				onModal('failed', 'Selected file has already been added');
				return;
			}
			setFiles((files: File[]) => [...files, file]);
			console.log([...files, file])
		}
	};

	const handleDrag = (e: any) => {
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

	const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
		if (!isLoading) {
			setDragActive(false);
			if (e.dataTransfer.files && e.dataTransfer.files[0]) {
				handleAllFiles(e.dataTransfer.files);
			}
		}
	};

	const onUpload = (e: any) => {
		if (files.length === 0) {
			onModal('failed', 'Select file to upload to NeoFS');
			return;
		}

		setLoading(true);
		files.forEach((file: File) => {
			onUploadFile(file);
		});
    e.preventDefault();
	};

	const onUploadFile = (file: any | null) => {
		document.cookie = `Bearer=${user.XBearer}; path=/gate/objects; expires=${new Date(Date.now() + 10 * 1000).toUTCString()}`;
		api('POST', "/gate/objects/", file, {
			'X-Attributes': JSON.stringify({
				'FileName': file.name,
				'Email': user.XAttributeEmail,
			}),
			'X-Neofs-Expiration-Duration': lifetimeData,
			'Content-Type': file.type === '' ? 'application/octet-stream' : '',
		}).then((res: any) => {
			res['filename'] = file.name;
			setUploadedObjects((uploadedObjectsTemp: UploadedObject[]) => [...uploadedObjectsTemp, res]);
			setFiles((files: File[]) => {
				const filesTemp = files.filter((item: File) => item.name !== file.name);
				if (filesTemp.length === 0) {
					setLoading(false);
				}
				return filesTemp;
			});
		}).catch(() => {
			setLoading(false);
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
								<Heading weight="semibold" subtitle style={{ textAlign: 'center' }}>Send.NeoFS: HTTP-gate demo for distributed object storage</Heading>
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
										label={dragActive ? "Drop the files here ..." : "Drag & Drop files or click to send up to 200Mb"}
										onChange={(e: any) => handleAllFiles(e.target.files)}
										icon={<FontAwesomeIcon icon={['fas', 'plus']} style={{ fontSize: 30 }} />}
										style={isLoading ? { display: 'flex', justifyContent: 'center', pointerEvents: 'none' } : { display: 'flex', justifyContent: 'center' }}
										// @ts-ignore: Not assignable to type
										inputProps={{ "multiple": true }}
										boxed
									/>
								</Form.Field>
								<Button.Group style={{ justifyContent: 'center', alignItems: 'end' }}>
									<Form.Field>
										<Form.Label>Select file(s) lifetime</Form.Label>
										<Form.Control>
											<Form.Select
												onChange={(e: any) => setLifetimeData(e.target.value)}
												value={lifetimeData}
												disabled={isLoading}
											>
												<option value="12h">12 epochs (hours)</option>
												<option value="24h">24 epochs (1 day)</option>
												<option value="48h">48 epochs (2 days)</option>
												<option value="96h">96 epochs (4 days)</option>
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
								{files && files.map((fileItem, index: number) => (
									<Notification
										key={fileItem.name}
										color="primary"
									>
										{fileItem.name}
										{!isLoading && (
											<Button
												onClick={(e: any) => handleFile(e, true, index)}
												remove
											/>
										)}
									</Notification>
								))}
								{uploadedObjects && uploadedObjects.length > 0 && (
									<>
										<Heading weight="semibold" subtitle style={{ textAlign: 'center', marginTop: '2rem' }}>
											Uploaded objects
										</Heading>
										{uploadedObjects.map((uploadedObject, index: number) => (
											<Notification
												key={uploadedObject.filename}
												className="uploaded_object"
												color="primary"
											>
												<div className="uploaded_object_group">
													<Heading size={6} subtitle>
														<a
															href={`${environment.server ? environment.server : ''}/gate/get/${uploadedObject.object_id}`}
															style={{ textDecoration: 'underline' }}
															rel="noopener noreferrer"
														>
															{uploadedObject.filename}
														</a>
														<CopyToClipboard
															text={`${environment.server ? environment.server : document.location.origin}/gate/get/${uploadedObject.object_id}`}
															onCopy={() => {
																setCopy(`name${index}`);
																setTimeout(() => {
																	setCopy(false);
																}, 700);
															}}
														>
															<div>
																<FontAwesomeIcon icon={['fas', 'copy']} />
																{isCopied === `name${index}` && (
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
													<Heading size={6} subtitle>
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
																setCopy(`link${index}`);
																setTimeout(() => {
																	setCopy(false);
																}, 700);
															}}
														>
															<div>
																<FontAwesomeIcon icon={['fas', 'copy']} />
																{isCopied === `link${index}` && (
																	<div className="tooltip" style={{ top: '-125%', left: '-165%' }}>Copied!</div>
																)}
															</div>
														</CopyToClipboard>
													</Heading>
												</div>
												<Heading size={6} subtitle>
													{`Container ID: ${uploadedObject.container_id}`}
													<CopyToClipboard
														text={uploadedObject.container_id}
														onCopy={() => {
															setCopy(`container_id${index}`);
															setTimeout(() => {
																setCopy(false);
															}, 700);
														}}
													>
														<div>
															<FontAwesomeIcon icon={['fas', 'copy']} />
															{isCopied === `container_id${index}` && (
																<div className="tooltip" style={{ top: '-125%', left: '-165%' }}>Copied!</div>
															)}
														</div>
													</CopyToClipboard>
												</Heading>
												<Heading size={6} subtitle>
													{`Object ID: ${uploadedObject.object_id}`}
													<CopyToClipboard
														text={uploadedObject.object_id}
														onCopy={() => {
															setCopy(`object_id${index}`);
															setTimeout(() => {
																setCopy(false);
															}, 700);
														}}
													>
														<div>
															<FontAwesomeIcon icon={['fas', 'copy']} />
															{isCopied === `object_id${index}` && (
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
								<Heading weight="semibold" subtitle style={{ textAlign: 'center' }}>Sign in with Google or GitHub account</Heading>
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
