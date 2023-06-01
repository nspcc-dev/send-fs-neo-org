import { useState } from 'react';
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	Navbar,
	Heading,
	Footer,
	Button,
} from 'react-bulma-components';
import Home from './Home';
import Agreement from './Agreement';
import Load from './Load';
import NotFound from './NotFound';
import 'bulma/css/bulma.min.css';
import './App.css';

import {
	faPlus,
	faXmark,
	faSpinner,
	faDownload,
	faCopy,
} from '@fortawesome/free-solid-svg-icons';
import {
	faCircleXmark,
} from '@fortawesome/free-regular-svg-icons';
import {
	faGoogle,
	faGithub,
} from '@fortawesome/free-brands-svg-icons';

library.add(
  faCopy,
  faDownload,
  faSpinner,
  faCircleXmark,
  faPlus,
  faXmark,
	faGoogle,
	faGithub,
);

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export const App = () => {
	const location = useLocation();
	const [environment] = useState({
		version: process.env.REACT_APP_VERSION,
		server: process.env.REACT_APP_NEOFS,
		netmapContract: process.env.REACT_APP_NETMAP_CONTRACT,
		epochLine: "c25hcHNob3RFcG9jaA==",
	});
	const [user] = useState(getCookie('X-Bearer') && getCookie('X-Attribute-Email') ? {
		XBearer: getCookie('X-Bearer'),
		XAttributeEmail: getCookie('X-Attribute-Email'),
	} : null);
	const [uploadedObjects, setUploadedObjects] = useState([]);
	const [menuActive, setMenuActive] = useState(false);
	const [modal, setModal] = useState({
		current: null,
		text: '',
		params: '',
	});

	const onModal = (current = null, text = null, params = null) => {
		setModal({ current, text, params });
	};

	const onRedirect = (path) => {
		document.location.pathname = path;
	};

	const onLogout = () => {
		setMenuActive(false);
		const date = new Date(Date.now() - 1).toUTCString();
		document.cookie = `Bearer=; expires=` + date;
		document.cookie = `X-Bearer=; expires=` + date;
		document.cookie = `X-Attribute-Email=; expires=` + date;
		onRedirect('/');
	};

	const onScroll = () => {
		document.querySelector('html').scrollTop = 0;
  }

	const onDownload = (objectId, filename) => {
		const a = document.createElement('a');
		document.body.appendChild(a);
		const url = `${environment.server ? environment.server : ''}/gate/get/${objectId}?download=1`;
		a.href = url;
		a.download = filename;
		a.click();
		setTimeout(() => {
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		}, 0);
	};

  return (
    <>
			{(modal.current === 'success' || modal.current === 'failed') && (
				<div className="modal">
					<div
						className="modal_close_panel"
						onClick={onModal}
					/>
					<div className="modal_content">
						<div
							className="modal_close"
							onClick={onModal}
						>
							<img
								src="/img/close.svg"
								height={30}
								width={30}
								alt="close"
							/>
						</div>
						<Heading weight="semibold" subtitle align="center">{modal.current === 'success' ? 'Success' : 'Failed'}</Heading>
						<p align="center">{modal.text}</p>
					</div>
				</div>
			)}
			{modal.current === 'loading' && (
				<div className="modal">
					<div className="modal_content">
						<Heading weight="semibold" subtitle align="center">{modal.text ? modal.text : 'Loading'}</Heading>
						<FontAwesomeIcon
							icon={['fas', 'spinner']}
							style={{ margin: '20px auto', display: 'flex', fontSize: 22 }}
							spin
						/>
					</div>
				</div>
			)}
			<Navbar>
				<Navbar.Brand>
					<Navbar.Item
						renderAs="div"
						style={{ cursor: 'default' }}
					>
						<img src="/img/logo.svg" height="28" width="112" alt="logo"/>
					</Navbar.Item>
					<Navbar.Burger
						className={menuActive ? 'is-active' : ''}
						onClick={() => setMenuActive(!menuActive)}
					/>
				</Navbar.Brand>
				<Navbar.Menu
					className={menuActive ? 'is-active' : ''}
				>
					<Navbar.Container>
						<Link
							to="/"
							className="navbar-item"
							onClick={() => setMenuActive(false)}
						>
							Upload
						</Link>
						<Link
							to="/agreement"
							className="navbar-item"
							onClick={() => setMenuActive(false)}
						>
							Agreement
						</Link>
					</Navbar.Container>
					{user && (
					<Navbar.Container align="right">
						<Navbar.Item
							renderAs="div"
							onClick={onLogout}
						>
							<Button>Logout</Button>
						</Navbar.Item>
					</Navbar.Container>
					)}
				</Navbar.Menu>
			</Navbar>
			<main style={{ minHeight: 'calc(100vh - 231.8px)' }}>
				<Routes>
					<Route
						path="/"
						element={<Home
							onModal={onModal}
							onScroll={onScroll}
							onDownload={onDownload}
							uploadedObjects={uploadedObjects}
							setUploadedObjects={setUploadedObjects}
							environment={environment}
							user={user}
						/>}
					/>
					<Route
						path="/load/:id"
						element={<Load
							onModal={onModal}
							onDownload={onDownload}
							onRedirect={onRedirect}
							environment={environment}
							location={location}
						/>}
					/>
					<Route
						path="/agreement"
						element={<Agreement />}
					/>
					<Route
						path="*"
						element={<NotFound />}
					/>
				</Routes>
			</main>
			<Footer
				style={{ padding: '40px 20px' }}
			>
				<div className="socials">
					<a href="https://neo.org/" target="_blank" rel="noopener noreferrer">
						<img
							src="/img/socials/neo.svg"
							width={26}
							height={26}
							style={{ filter: 'invert(1)' }}
							alt="neo logo"
						/>
					</a>
					<span className="social_pipe">
						<a href="https://nspcc.io" target="_blank" rel="noopener noreferrer">
							<img
								src="/img/socials/neo_spcc.svg"
								width={37}
								height={37}
								alt="neo spcc logo"
							/>
						</a>
					</span>
					<a href="https://github.com/nspcc-dev" target="_blank" rel="noopener noreferrer" style={{ paddingLeft: 10 }}>
						<img
							src="/img/socials/github.svg"
							width={30}
							height={30}
							alt="github logo"
						/>
					</a>
					<a href="https://twitter.com/neospcc" target="_blank" rel="noopener noreferrer">
						<img
							src="/img/socials/twitter.svg"
							width={30}
							height={30}
							alt="twitter logo"
						/>
					</a>
					<a href="https://www.youtube.com/@neospcc5818" target="_blank" rel="noopener noreferrer">
						<img
							src="/img/socials/youtube.svg"
							width={30}
							height={30}
							alt="youtube logo"
						/>
					</a>
					<a href="https://neospcc.medium.com/" target="_blank" rel="noopener noreferrer">
						<img
							src="/img/socials/medium.svg"
							width={30}
							height={30}
							alt="medium logo"
						/>
					</a>
				</div>
				<Heading
					size={6}
					weight="light"
					subtitle
					align="center"
					style={{ marginBottom: '0.3rem' }}
				>
					Send.NeoFS
				</Heading>
				<Heading
					size={7}
					weight="light"
					subtitle
					align="center"
				>
					{environment.version}
				</Heading>
			</Footer>
    </>
  );
}
