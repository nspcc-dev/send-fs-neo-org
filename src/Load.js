import { useEffect, useState } from 'react';
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
	onDownload,
	onRedirect,
	environment,
	location,
}) => {
	const [objectData, setObjectData] = useState({
		objectId: null,
	});
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

  return (
		<Container>
			{objectData.objectId && (
				<Section>
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
										style={{ marginRight: 20 }}
										onClick={() => onDownload(objectData.objectId, objectData.filename)}
									>
										<span>Download</span>
										<FontAwesomeIcon icon={['fas', 'download']} style={{ marginLeft: 5, fontSize: 14 }} />
									</Button>
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
											<FontAwesomeIcon icon={['fas', 'copy']} style={{ marginLeft: 5, fontSize: 14 }} />
											{isCopied && (
												<div className='tooltip'>Copied!</div>
											)}
										</Button>
									</CopyToClipboard>
								</Button.Group>
								<Button.Group style={{ justifyContent: 'center' }}>
									<a
										href={`${environment.server ? environment.server : ''}/gate/get/${objectData.objectId}`}
										rel="noopener noreferrer"
										style={{ textDecoration: 'underline' }}
									>
										<span>Open file by link</span>
									</a>
								</Button.Group>
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
								<Heading weight="semibold" subtitle align="center">File data</Heading>
								<Heading weight="light" size="6" subtitle style={{ margin: '10px 0' }}>{`Filename: ${objectData.filename ? objectData.filename : '-'}`}</Heading>
								<Heading weight="light" size="6" subtitle style={{ margin: '10px 0' }}>{`Size: ${objectData.size ? objectData.size : '-'}`}</Heading>
								<Heading weight="light" size="6" subtitle style={{ margin: '10px 0' }}>{`Expiration epoch: ${objectData.expirationEpoch ? objectData.expirationEpoch : '-'}`}</Heading>
								<Heading weight="light" size="6" subtitle style={{ margin: '10px 0' }}>{`Owner ID: ${objectData.ownerId ? objectData.ownerId : '-'}`}</Heading>
								<Heading weight="light" size="6" subtitle style={{ margin: '10px 0' }}>{`Container ID: ${objectData.containerId ? objectData.containerId : '-'}`}</Heading>
								<Heading weight="light" size="6" subtitle style={{ margin: '10px 0' }}>{`Object ID: ${objectData.objectId ? objectData.objectId : '-'}`}</Heading>
							</Tile>
						</Tile>
					</Tile>
				</Section>
			)}
		</Container>
  );
}

export default Load;
