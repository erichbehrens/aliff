/* eslint-disable max-len */
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Options.css';

class Options extends React.Component {
	render() { // eslint-disable-line class-methods-use-this
		return <div className={`${styles.options}`}>
			<div className={`${styles.panel}`}>
				<h1>ALIFF</h1>
				<h2>Awesome Lorem Ipsum Generator &amp; Form Filler</h2>
				<p>Select an input field on your page, press <strong>CTRL+Q</strong>, press enter. Done!</p>
				<p>You can also use your <strong>arrow keys</strong> or <strong>mouse</strong> to play around with the settings and customize the length of the text to insert or generate different values.</p>
			</div>
			<div className={`${styles.panel}`}>
				<h3>Playground</h3>
				<div className={styles.playground}>
					<div className={styles.description}>
						<h4>Text</h4>
						<p>Generates a random phrase, you can select 1 to 10 words.</p>
						<p>Arrow left/up: select less words</p>
						<p>Arrow right/down: select more words</p>
						<p>Mouse: move and click to select and insert</p>
					</div>
					<div className={styles.field}>
						<fieldset>
							<input id="text" type="text" required />
							<label htmlFor="text">Text</label>
						</fieldset>
					</div>
					<div className={styles.description}>
						<h4>Email</h4>
						<p>Generates a random email address.</p>
						<p>Arrow keys: generate a new address</p>
					</div>
					<div className={styles.field}>
						<fieldset>
							<input id="email" type="email" required />
							<label htmlFor="email">Email</label>
						</fieldset>
					</div>
					<div className={styles.description}>
						<h4>Number</h4>
						<p>Generates a random number. From left to right each box generates a number with a greater power of 10. First box 0-9, second 100-999, third 1000-9999 etc.</p>
						<p>Arrow left/right: decrease/increase the power</p>
						<p>Arrow up/down: generate a new number with the current power setting</p>
						<p>Mouse: move to generate new numbers andcustomize the power, then click insert</p>
					</div>
					<div className={styles.field}>
						<fieldset>
							<input id="number" type="number" required />
							<label htmlFor="number">Some number</label>
						</fieldset>
					</div>
					<div className={styles.description}>
						<h4>Phone</h4>
						<p>Generates a random phone number.</p>
						<p>Arrow keys / mouse move: generate a new number</p>
					</div>
					<div className={styles.field}>
						<fieldset>
							<input id="tel" type="tel" required />
							<label htmlFor="tel">Phone</label>
						</fieldset>
					</div>
					<h4>Paragraph</h4>
					<p>
						Generates random paragraphs.
						You can select the number of paragraphs and number of sentences in each paragraph.
						To better simulate real world randomness, the actual number of sentences will be slightly randomized (ie: if you select 6 you could get 5 to 7 sentences) and each sentence length is also random.
						You can enable or disable the html option to insert random headings, strong, em and u tags
					</p>
					<p>Arrow keys / mouse move: adjust the settings</p>
					<p>Mouse click: select options and insert text</p>
					<fieldset className={styles.textarea}>
						<textarea id="textarea" required />
						<label htmlFor="textarea">Textarea</label>
					</fieldset>
					<h4>Content editable</h4>
					<div className={styles.contentEditable} contentEditable />
				</div>
			</div>
		</div>;
	}
}

ReactDOM.render(<Options />, document.getElementById('app'));

setTimeout(() => {
	window.analytics(['_setAccount', 'UA-115456762-1']);
	window.analytics(['_trackPageview']);
}, 1000);
