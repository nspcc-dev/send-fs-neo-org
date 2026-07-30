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
								<p>Send stores data in a NeoFS container. In fact, there are two of them: one is used for the application itself which is served to users via a <a href="https://fs.neo.org/hosting/" target="_blank" rel="noopener noreferrer">standard NeoFS website hosting scheme</a>, but the other is used for uploaded data. This container uses "eacl-public-read-write" basic ACLs, but then limits uploads and privately sent files with this EACL setup:</p>
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
    },
    {
      "operation": "GET",
      "action": "DENY",
      "filters": [
        {
          "headerType": "OBJECT",
          "matchType": "STRING_NOT_EQUAL",
          "key": "Receiver",
          "value": ""
        }
      ],
      "targets": [
        {
          "role": "OTHERS",
          "keys": []
        }
      ]
    },
    {
      "operation": "HEAD",
      "action": "DENY",
      "filters": [
        {
          "headerType": "OBJECT",
          "matchType": "STRING_NOT_EQUAL",
          "key": "Receiver",
          "value": ""
        }
      ],
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
								<p>The first two rules don't allow anyone but the container owner (NeoSPCC) to upload and delete objects. Which is what we need to make the container secure, as you can see here uploads are only allowed after authentication. This is enforced at the NeoFS level using EACL above.</p>
								<p>The last two rules are what makes private sending work. A filter with an empty value and the "STRING_NOT_EQUAL" match type matches every object that carries a non-empty "Receiver" attribute, and objects without this attribute are not affected by the record at all. So a regular upload stays readable by anyone with the link, while an object marked with "Receiver" can't be read (and its headers can't even be fetched) by an anonymous user.</p>
								<p>To be able to upload data into this container one needs to obtain a bearer token which has a different set of EACL rules. This token is provided to the user by <a href="https://github.com/nspcc-dev/neofs-oauthz" target="_blank" rel="noopener noreferrer">neofs-oauthz</a> utility running on the backend. It's an OAuth 2.0 authenticator application that performs exchange with the provider and if everything is fine creates and signs (using container owner's key) token that allows to PUT an object if:</p>
								<ul>
									<li>it has a hash of user's e-mail in the "Email" attribute</li>
									<li>it has "Content-Type" attribute and this attribute doesn't contain "text/html", "application/javascript" and other similar types</li>
									<li>its payload is smaller than configured number (which is 200 MB now)</li>
									<li>it has an expiration attribute that is lower than token lifetime plus the maximum expected normal expiration time (96 epochs)</li>
								</ul>
								<p>The very same token also carries a pair of records that allow "GET" and "HEAD" for objects whose "Receiver" attribute equals the SHA-256 hash of the logged in user's e-mail, followed by a deny for any other non-empty "Receiver". A bearer token's EACL table replaces the container one completely, so this is exactly what turns a "no one can read it" object into a "only this account can read it" object.</p>
								<p>This token itself expires in 30 epochs by default (~30 hours). "Email" attribute is one of the key things, Send.NeoFS marks objects this way which allows to trace it back to logged in account in case some inappropriate content is uploaded. Other rules ensure the security of Send, we can't allow very big files, we can't store them forever and we can't allow content that can be used for XSS and HTML injection attacks. Most importantly these restrictions are enforced by NeoFS itself, there is no other application-specific backend that filters content or does some specific requests to NeoFS.</p>
								<p>Bearer token is returned to browser via <code>X-Bearer</code> cookie and then used by the <a href="https://github.com/nspcc-dev/send-fs-neo-org" target="_blank" rel="noopener noreferrer">frontend part</a> to communicate with the standard <a href="https://github.com/nspcc-dev/neofs-rest-gw/" target="_blank" rel="noopener noreferrer">NeoFS REST gateway</a>. There is just an nginx proxy that does reroutings to authenticator and provides simpler URLs for objects. The token can be extracted from the browser and used in other applications, but it still maintains the same limitations, NeoFS will not allow random objects to be uploaded with it.</p>
								<Heading weight="semibold" size={5} subtitle style={{ marginTop: '1.5rem' }}>Sending files privately</Heading>
								<p>By default a Send.NeoFS link allows anyone to download the file. The "Send privately" option changes that and makes the file readable by a single e-mail address only. It's built with the same primitives described above, there is still no application-specific backend that checks anything, access is decided by NeoFS storage nodes themselves. The flow is:</p>
								<ul>
									<li>the sender checks "Send privately" and types the receiver's e-mail, the browser computes a SHA-256 hash of it and puts the hex digest into the "Receiver" object attribute next to the usual "FileName" and "Email" ones. The address itself never leaves the browser, only its hash is stored in NeoFS</li>
									<li>the sender gets a <code>/load/OBJECT_ID</code> link instead of a direct <code>/gate/get/OBJECT_ID</code> one. A direct gateway link would be useless here, an anonymous request for such an object is rejected by the storage nodes</li>
									<li>when the receiver opens the link, the request is made with the bearer token of the currently logged in user. If the "Receiver" hash matches, the file is shown and downloaded as usual, otherwise NeoFS answers with 403 and the page offers to sign in with the address the file was sent to</li>
								</ul>
								<p>The receiver has to sign in with exactly the address the file was sent to, using any of the supported OAuth providers, the hash doesn't depend on the provider. And, of course, the file still disappears when its expiration epoch comes, private or not.</p>
							</Content>
						</Tile>
					</Tile>
				</Tile>
			</Section>
		</Container>
	);
};

export default About;
