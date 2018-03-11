import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Options.css';

class Options extends React.Component {
	render() { // eslint-disable-line class-methods-use-this
		return <div className={styles.message}>
			Extension playground
			<form>
				<input /> input<br />
				<input type="text" /> input type=text<br />
				<input type="number" /> input type=number<br />
				<input type="tel" /> inopput type=tel<br />
				<input type="email" /> input type=email<br />
				<input type="date" /> input type=date<br />
				<br />
				Textarea:<br />
				<textarea rows={20} cols={80} /><br />
				<br />
				Content editable<br />
				<div className={styles.contentEditable} contentEditable />
			</form>
		</div>;
	}
}

ReactDOM.render(<Options />, document.getElementById('app'));

setTimeout(() => {
	window.analytics(['_setAccount', 'UA-115456762-1']);
	window.analytics(['_trackPageview']);
}, 1000);
