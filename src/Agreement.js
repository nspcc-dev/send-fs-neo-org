import {
	Content,
	Container,
	Section,
	Heading,
	Tile,
	Notification,
} from 'react-bulma-components';

const Agreement = () => {
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
							<Heading weight="semibold" subtitle align="center">Terms of Service</Heading>
							<Content>
								<p>Neo Saint Petersburg Competence Center (Neo SPCC) was established to support the Neo core and do research in distributed storage systems field.</p>
								<p>This is a test service. Neo SPCC is not responsible for losing uploaded data. All the uploaded data is presumed to be public.</p>
								<p>The service is designed for individuals 18 years of age or older. As a user of the service you will uphold these terms of service and are responsible for all activities and content you post/upload.</p>
								<p>In addition to upholding these terms of service, you are responsible for adhering to all applicable local and international laws.</p>
								<p>Neo SPCC is not responsible for the content uploaded by users.</p>
							</Content>
						</Tile>
					</Tile>
				</Tile>
			</Section>
		</Container>
	);
};

export default Agreement;
