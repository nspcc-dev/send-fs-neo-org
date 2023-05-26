import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	Button,
	Container,
	Section,
	Heading,
	Tile,
	Notification,
} from 'react-bulma-components';
import api from './api';

const Load = ({
	onModal,
	onRedirect,
	environment,
	location,
}) => {
	const [objectData, setObjectData] = useState({
		objectId: null,
	});
	const [isLoading, setLoading] = useState(false);
	const [isCopied, setCopied] = useState(false);

  useEffect(() => {
		const objectIDTemp = location.pathname.replace('/load/', '');
		if (objectIDTemp.length > 0) {
			api('HEAD', `/gate/get/${objectIDTemp}`).then((res) => {
				setObjectData({
					...res,
					objectId: objectIDTemp,
				});
			}).catch(() => {
				onModal('failed', 'Something went wrong, try again');
			});
		} else {
			onRedirect('/');
		}
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

	const onDownload = () => {
		setLoading(true);
		const a = document.createElement('a');
		document.body.appendChild(a);
		const url = `${environment.server ? environment.server : ''}/gate/get/${objectData.objectId}?download=1`;
		a.href = url;
		a.download = objectData.filename;
		a.click();
		setTimeout(() => {
			setLoading(false);
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		}, 0);
	};

  return (
		<Container>
			<Section>
				{objectData.objectId && (
					<Tile kind="ancestor">
						<Tile kind="parent">
							<Tile
								kind="child"
								renderAs={Notification}
								color={"gray"}
							>
								<Heading weight="semibold" subtitle align="center">Download your files via HTTP gate</Heading>
								<Button.Group style={{ justifyContent: 'center' }}>
									<Button
										onClick={onDownload}
									>
										<span>Download</span>
										<FontAwesomeIcon icon={isLoading ? ['fas', 'spinner'] : ['fas', 'file-arrow-down']} style={{ marginLeft: 5, fontSize: 14 }} spin={isLoading} />
									</Button>
								</Button.Group>
								<Button.Group style={{ justifyContent: 'center' }}>
									<CopyToClipboard
										text={`${environment.server ? environment.server : document.location.origin}/gate/get/${objectData.objectId}`}
										onCopy={() => {
											setCopied(true);
											setTimeout(() => {
												setCopied(false);
											}, 700);
										}}
									>
										<Button>
											<span>Copy link</span>
											<FontAwesomeIcon icon={['fas', 'link']} style={{ marginLeft: 5, fontSize: 14 }} />
											{isCopied && (
												<div className='tooltip'>Copied!</div>
											)}
										</Button>
									</CopyToClipboard>
								</Button.Group>
								<Button.Group style={{ justifyContent: 'center' }}>
									<Link
										to={`${environment.server ? environment.server : ''}/gate/get/${objectData.objectId}`}
										target='_blank'
										rel="noopener noreferrer"
										style={{ textDecoration: 'underline' }}
									>
										<span>Open file by link</span>
										<FontAwesomeIcon icon={['fas', 'square-arrow-up-right']} style={{ marginLeft: 5 }} />
									</Link>
								</Button.Group>
								<Heading weight="light" size="6" subtitle align="center" style={{ margin: '40px 0 10px 0' }}>{`Container ID: ${objectData.containerId}`}</Heading>
								<Heading weight="light" size="6" subtitle align="center">{`Object ID: ${objectData.objectId}`}</Heading>
								<Heading weight="light" size="6" subtitle align="center">{`Owner ID: ${objectData.ownerId}`}</Heading>
							</Tile>
						</Tile>
					</Tile>
				)}
			</Section>
		</Container>
  );
}

export default Load;
