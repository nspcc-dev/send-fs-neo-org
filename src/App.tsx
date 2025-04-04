import React, { useState } from 'react';
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	Navbar,
	Heading,
	Footer,
	Button,
} from 'react-bulma-components';
import Home from './Home.tsx';
import Agreement from './Agreement.tsx';
import About from './About.tsx';
import Load from './Load.tsx';
import NotFound from './NotFound.tsx';
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

interface Environment {
	version: string | undefined
	server: string | undefined
}

interface User {
	XBearer: string | undefined
	XAttributeEmail: string | undefined
}

export interface UploadedObject {
	filename: string
	container_id: string
	object_id: string
}

interface Modal {
	current: "success" | "failed" | null
	text: string | null
	params: any
}

function getCookie(name: string) {
  let matches: string[] | null = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([.$?*|{}()[]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export const App = () => {
	const location: any = useLocation();
	const [environment] = useState<Environment>({
		version: import.meta.env.VITE_VERSION,
		server: import.meta.env.VITE_NEOFS,
	});
	const [user] = useState<User | null>(getCookie('X-Bearer') && getCookie('X-Attribute-Email') ? {
		XBearer: getCookie('X-Bearer'),
		XAttributeEmail: getCookie('X-Attribute-Email'),
	} : null);
	const [uploadedObjects, setUploadedObjects] = useState<UploadedObject[]>([]);
	const [menuActive, setMenuActive] = useState<boolean>(false);
	const [modal, setModal] = useState<Modal>({
		current: null,
		text: '',
		params: '',
	});

	const onModal = (current: "success" | "failed" | null = null, text: string | null = null, params: any = null) => {
		setModal({ current, text, params });
	};

	const onRedirect = (path: string) => {
		document.location.pathname = path;
	};

	const onLogout = () => {
		setMenuActive(false);
		const date: string = new Date(Date.now() - 1).toUTCString();
		document.cookie = `Bearer=; expires=` + date;
		document.cookie = `X-Bearer=; expires=` + date;
		document.cookie = `X-Attribute-Email=; expires=` + date;
		onRedirect('/');
	};

	const onScroll = () => {
		const html: HTMLElement | null = document.querySelector('html');
		if (html) {
			html.scrollTop = 0;
		}
  }

	const onDownload = (objectId: string, filename: string) => {
		const a: HTMLAnchorElement = document.createElement('a');
		document.body.appendChild(a);
		const url: string = `${environment.server ? environment.server : ''}/gate/get/${objectId}?download=1`;
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
						onClick={() => onModal()}
					/>
					<div className="modal_content">
						<div
							className="modal_close"
							onClick={() => onModal()}
						>
							<img
								src="/img/close.svg"
								height={30}
								width={30}
								alt="close"
							/>
						</div>
						<Heading weight="semibold" subtitle style={{ textAlign: 'center' }}>{modal.current === 'success' ? 'Success' : 'Failed'}</Heading>
						<p style={{ textAlign: 'center' }}>{modal.text}</p>
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
					<Navbar.Container className="navbar-start">
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
						<Link
							to="/about"
							className="navbar-item"
							onClick={() => setMenuActive(false)}
						>
							About
						</Link>
					</Navbar.Container>
					{user && (
					<Navbar.Container align="right">
						<Navbar.Item
							renderAs="div"
							onClick={onLogout}
						>
							<Button renderAs="button">Logout</Button>
						</Navbar.Item>
					</Navbar.Container>
					)}
				</Navbar.Menu>
			</Navbar>
			<main style={{ minHeight: 'calc(100vh - 218px)' }}>
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
						path="/about"
						element={<About />}
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
					<a href="https://www.youtube.com/@NeoSPCC" target="_blank" rel="noopener noreferrer">
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
				<a href="https://fs.neo.org/hosting/">
					<Heading
						weight="light"
						subtitle
						style={{ textAlign: 'center', fontSize: '.75rem', marginBottom: 0 }}
					>
						<span style={{ textDecoration: 'underline' }}>Hosted on NeoFS</span>
					</Heading>
				</a>
				<Heading
					weight="light"
					subtitle
					style={{ textAlign: 'center', fontSize: '.75rem' }}
				>
					{environment.version}
				</Heading>
			</Footer>
    </>
  );
}
