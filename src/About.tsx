import React from 'react';
import {
	Content,
	Container,
	Section,
	Heading,
	Tile,
	Notification,
} from 'react-bulma-components';

const About = () => {
	return (
		<Container>
			<Section>
				<Tile kind="ancestor" id="about">
					<Tile kind="parent">
						<Tile
							kind="child"
							renderAs={Notification}
							color={"gray"}
						>
							<Heading weight="semibold" subtitle style={{ textAlign: 'center' }}>About Service</Heading>
							<Content>
								<p>Send.NeoFS is a demo application that allows to upload temporary (to be deleted after expiration) files into NeoFS that can be fetched by anyone with the link. It uses a number of NeoFS technologies, so it's a good reference for a complete application that solves some end-user problem. It runs in testnet since it's not intended (and doesn't provide in fact) any long-term storage.</p>
								<p>Send stores data in a NeoFS container. In fact, there are two of them: one is used for the application itself which is served to users via a <a href="https://fs.neo.org/hosting/" target="_blank" rel="noopener noreferrer">standard NeoFS website hosting scheme</a>, but the other is used for uploaded data. This container uses "eacl-public-read-write" basic ACLs, but then limits uploads with this EACL setup:</p>
<pre>
{`{
  "version": {
    "major": 2,
    "minor": 13
  },
  "containerID": {
    "value": "WjCnuT1qPenbAEvs869WjnzJuIi7A0ZEgmIKZ7bxlWE="
  },
  "records": [
    {
      "operation": "PUT",
      "action": "DENY",
      "filters": [],
      "targets": [
        {
          "role": "OTHERS",
          "keys": []
        }
      ]
    },
    {
      "operation": "DELETE",
      "action": "DENY",
      "filters": [],
      "targets": [
        {
          "role": "OTHERS",
          "keys": []
        }
      ]
    }
  ]
}`}
</pre>
								<p>This set of rules doesn't allow anyone but the container owner (NeoSPCC) to upload and delete objects. Which is what we need to make the container secure, as you can see here uploads are only allowed after authentication. This is enforced at the NeoFS level using EACL above.</p>
								<p>To be able to upload data into this container one needs to obtain a bearer token which has a different set of EACL rules. This token is provided to the user by <a href="https://github.com/nspcc-dev/neofs-oauthz" target="_blank" rel="noopener noreferrer">neofs-oauthz</a> utility running on the backend. It's an OAuth 2.0 authenticator application that performs exchange with the provider and if everything is fine creates and signs (using container owner's key) token that allows to PUT an object if:</p>
								<ul>
									<li>it has a hash of user's e-mail in the "Email" attribute</li>
									<li>it has "Content-Type" attribute and this attribute doesn't contain "text/html", "application/javascript" and other similar types</li>
									<li>its payload is smaller than configured number (which is 200 MB now)</li>
									<li>it has an expiration attribute that is lower than token lifetime plus the maximum expected normal expiration time (96 epochs)</li>
								</ul>
								<p>This token itself expires in 30 epochs by default (~30 hours). "Email" attribute is one of the key things, Send.NeoFS marks objects this way which allows to trace it back to logged in account in case some inappropriate content is uploaded. Other rules ensure the security of Send, we can't allow very big files, we can't store them forever and we can't allow content that can be used for XSS and HTML injection attacks. Most importantly these restrictions are enforced by NeoFS itself, there is no other application-specific backend that filters content or does some specific requests to NeoFS.</p>
								<p>Bearer token is returned to browser via <code>X-Bearer</code> cookie and then used by the <a href="https://github.com/nspcc-dev/send-fs-neo-org" target="_blank" rel="noopener noreferrer">frontend part</a> to communicate with the standard <a href="https://github.com/nspcc-dev/neofs-rest-gw/" target="_blank" rel="noopener noreferrer">NeoFS REST gateway</a>. There is just an nginx proxy that does reroutings to authenticator and provides simpler URLs for objects. The token can be extracted from the browser and used in other applications, but it still maintains the same limitations, NeoFS will not allow random objects to be uploaded with it.</p>
							</Content>
						</Tile>
					</Tile>
				</Tile>
			</Section>
		</Container>
	);
};

export default About;
