import {
	Content,
	Container,
	Section,
	Heading,
	Tile,
	Notification,
} from 'react-bulma-components';

const Agreement = ({ user }) => {
	return (
		<Container>
			{user && (
				<Section>
					<Tile kind="ancestor">
						<Tile kind="parent">
							<Tile
								kind="child"
								renderAs={Notification}
								color={"gray"}
							>
								<Heading weight="semibold" subtitle align="center">Terms of Service</Heading>
								<Content>
									<p>NEO Saint Petersburg Competence Center (NEO SPCC) was established to support the NEO core and do research in distributed storage systems field.</p>
									<p>This is a test service. NEO SPCC is not responsible for losing uploaded data. All the uploaded data is presumed to be public.</p>
									<p>The service is designed for individuals 18 years of age or older. As a user of the service you will uphold these terms of service and are responsible for all activities and content you post/upload.</p>
									<p>In addition to upholding these terms of service, you are responsible for adhering to all applicable local and international laws.</p>
									<p>NEO SPCC is not responsible for the content uploaded by users.</p>
								</Content>
							</Tile>
						</Tile>
					</Tile>
				</Section>
			)}
		</Container>
	);
};

export default Agreement;
