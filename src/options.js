import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Options.css';

class Options extends React.Component {
	render() { // eslint-disable-line class-methods-use-this
		return <div>
			<div className={`${styles.panel} ${styles.playground}`}>
				<form>
					<h1>Extension playground</h1>
					<fieldset>
						<input id="text" type="text" required />
						<label for="text">Text</label>
					</fieldset>
					<fieldset>
						<input id="email" type="email" required />
						<label for="email">Email</label>
					</fieldset>
					<fieldset>
						<input id="tel" type="tel" required />
						<label for="tel">Phone</label>
					</fieldset>
					<fieldset>
						<input id="number" type="number" required />
						<label for="number">Some number</label>
					</fieldset>
					<fieldset>
						<textarea required />
						<label>Textarea</label>
					</fieldset>
					<br />
					Content editable<br />
					<div className={styles.contentEditable} contentEditable />
				</form>
			</div>
		</div>;
	}
}

ReactDOM.render(<Options />, document.getElementById('app'));

setTimeout(() => {
	window.analytics(['_setAccount', 'UA-115456762-1']);
	window.analytics(['_trackPageview']);
}, 1000);
