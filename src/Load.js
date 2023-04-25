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

const Load = ({
	onRedirect,
	environment,
	location,
	user,
}) => {
	const [objectID, setObjectID] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const [isCopied, setCopied] = useState(false);

  useEffect(() => {
		const objectIDTemp = location.pathname.replace('/load/', '');
		if (objectIDTemp.length > 0) {
			setObjectID(objectIDTemp);
		} else {
			onRedirect('/');
		}
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

	const onDownload = () => {
		setLoading(true);
		let downloadLink = document.createElement('a');
		downloadLink.href = `${environment.server ? environment.server : ''}/gate/get/${objectID}?download=1`;
		downloadLink.target = '_blank';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		setTimeout(() => {
			setLoading(false);
			document.body.removeChild(downloadLink);
		}, 0);
	};

  return (
		<Container>
			{user && (
				<Section>
					{objectID && (
						<Tile kind="ancestor">
							<Tile kind="parent">
								<Tile
									kind="child"
									renderAs={Notification}
									color={"gray"}
								>
									<Heading weight="semibold" subtitle align="center">Download your files via HTTP-gate</Heading>
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
											text={`${environment.server ? environment.server : document.location.origin}/gate/get/${objectID}`}
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
											to={`${environment.server ? environment.server : ''}/gate/get/${objectID}`}
											target='_blank'
											rel="noopener noreferrer"
											style={{ textDecoration: 'underline' }}
										>
											<span>Open file by link</span>
											<FontAwesomeIcon icon={['fas', 'square-arrow-up-right']} style={{ marginLeft: 5 }} />
										</Link>
									</Button.Group>
									<Heading weight="light" size="6" subtitle align="center" style={{ margin: '40px 0 10px 0' }}>{`Container ID: ${environment.containerID}`}</Heading>
									<Heading weight="light" size="6" subtitle align="center">{`Object ID: ${objectID}`}</Heading>
								</Tile>
							</Tile>
						</Tile>
					)}
				</Section>
			)}
		</Container>
  );
}

export default Load;
