import React from 'react';
import {
	Container,
	Section,
	Heading,
	Tile,
	Notification,
	Button,
} from 'react-bulma-components';

const NotFound = () => {
	return (
		<Container>
			<Section>
				<Tile kind="ancestor">
					<Tile kind="parent">
						<Tile
							kind="child"
							renderAs={Notification}
							color={"gray"}
						>
							<Heading weight="semibold" subtitle style={{ textAlign: 'center' }}>404 Not Found</Heading>
							<Heading weight="light" subtitle style={{ textAlign: 'center' }}>Page not found</Heading>
							<Button.Group style={{ justifyContent: 'center' }}>
								<Button renderAs="a" href="/">Home page</Button>
							</Button.Group>
						</Tile>
					</Tile>
				</Tile>
			</Section>
		</Container>
	);
};

export default NotFound;
