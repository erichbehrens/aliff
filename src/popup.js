import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Popup.css';
import { getWords, getParagraphs, getEmail, getRandomNumber } from './utils/loremIpsum';

class Popup extends React.Component {
	state = {
		text: '',
		options: {
			words: 4,
			paragraphs: 5,
			paragraphSentences: 8,
			numberPower: 4,
			html: false,
		},
		preview: {
			paragraphs: undefined,
			paragraphSentences: undefined,
			numberPower: undefined,
			words: undefined,
		},
	};

	componentDidMount() {
		this.getActiveElement();
	}

	getActiveElement = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{ action: { type: 'getActiveElement' } },
				(response) => {
					const { options } = this.state;
					const nextState = { activeElement: response };
					if (!response) {
						options.html = true;
						nextState.options = options;
						nextState.text = this.getText('paragraphs', options);
					} else if (['div', 'textarea'].includes(response.elementType)) {
						options.html = response.elementType === 'div';
						nextState.options = options;
						nextState.text = this.getText('paragraphs', options);
					} else if (['number', 'tel'].includes(response.type)) {
						options.numberPattern = response.type === 'tel' ? '+## ## ### ## ##' : undefined;
						nextState.text = this.getNumber(options);
					} else if (['email'].includes(response.type)) {
						nextState.text = this.getText('email');
					} else {
						nextState.text = this.getText('words');
					}
					this.setState(nextState, this.setEnterHandler);
				},
			);
		});
	}

	setEnterHandler = () => {
		window.addEventListener('keyup', (event) => {
			if (event.which === 13) {
				this.action();
			}
		});
	}

	action = () => {
		const { activeElement } = this.state;
		if (activeElement && activeElement.type === 'text') {
			this.insertWords();
			return;
		}
		this.insertText();
	}

	insertText = () => {
		const { options } = this.state;
		if (options.html) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(this.ref);
			selection.removeAllRanges();
			selection.addRange(range);
		} else {
			this.ref.focus();
			this.ref.select();
		}
		document.execCommand('copy');
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, { action: { type: 'insertText' } });
			window.close();
		});
	}

	insertWords = () => {
		const { preview, options, text } = this.state;
		options.words = preview.words || options.words;
		preview.words = undefined;
		const selectedText = text.split(' ').slice(0, options.words).join(' ');
		this.setState({ preview, options, text: selectedText }, this.insertText);
	}

	insertNumber = () => {
		const { preview, options } = this.state;
		options.numberPower = preview.numberPower;
		preview.numberPower = undefined;
		this.setState({ preview, options });
		this.insertText();
	}

	insertMultilineText = () => {
		const { preview, options } = this.state;
		options.paragraphs = preview.paragraphs;
		preview.paragraphs = undefined;
		options.paragraphSentences = preview.paragraphSentences;
		preview.paragraphSentences = undefined;
		const text = this.getText('paragraphs', options);
		this.setState({ preview, options, text }, this.insertText);
	}

	getText = (type, options = this.state.options) => {
		switch (type) {
			case 'email':
				return getEmail();
			case 'words':
				return getWords(10);
			case 'paragraphs':
				return getParagraphs(options.paragraphs, options.paragraphSentences, 15, options.html);
		}
		return '';
	};

	getNumber = (options = this.state.options) => {
		if (options.numberPattern) {
			return options.numberPattern.replace(/#/g, () => getRandomNumber(9));
		}
		const base = 10 ** (options.numberPower - 1);
		return getRandomNumber(base, (base * 10) - 1);
	}

	isDrawing = false;
	setMultilinePreview = (event) => {
		if (!this.isDrawing) {
			event.persist();
			requestAnimationFrame(() => {
				const { preview } = this.state;
				const el = this.multilineOptionsGrid.getBoundingClientRect();
				preview.paragraphs = Math.ceil(((event.clientY - el.top) / el.height) * 10);
				preview.paragraphSentences = Math.ceil(((event.clientX - el.left) / el.width) * 15);
				this.setState({ preview });
			});
		}
	}

	resetMultilinePreview = () => {
		const { preview } = this.state;
		preview.paragraphs = undefined;
		preview.paragraphSentences = undefined;
		this.setState({ preview });
	}

	setNumberPreview = (event) => {
		if (!this.isDrawing) {
			event.persist();
			requestAnimationFrame(() => {
				const { preview, options } = this.state;
				if (options.numberPattern) {
					const text = this.getNumber(options);
					this.setState({ text });
					return;
				}
				const el = this.numberPowerGrid.getBoundingClientRect();
				const numberPower = Math.ceil(((event.clientX - el.left) / el.width) * 10);
				const text = this.getNumber({ numberPower });
				preview.numberPower = numberPower;
				this.setState({ preview, text });
			});
		}
	}

	resetNumberPreview = () => {
		const { preview, options } = this.state;
		const text = this.getNumber(options);
		preview.numberPower = undefined;
		this.setState({ preview, text });
	}

	setText = (type) => {
		const text = this.getText(type);
		this.setState({ text });
	}

	setSinglelinePreview = (words) => {
		if (!this.isDrawing) {
			requestAnimationFrame(() => {
				const { preview } = this.state;
				preview.words = words;
				this.setState({ preview });
			});
		}
	}

	resetSinglelinePreview = () => {
		const { preview } = this.state;
		preview.words = undefined;
		this.setState({ preview });
	}

	toggleHtml = (event) => {
		const { options } = this.state;
		options.html = event.target.checked;
		const text = this.getText('paragraphs', options);
		this.setState({ options, text });
	}

	render() {
		const { activeElement, text, options, preview, debug } = this.state;
		const type = activeElement && activeElement.type;
		const isMultiline = activeElement && ['div', 'textarea'].includes(activeElement.elementType);
		const isSingleline = activeElement && ['input'].includes(activeElement.elementType);
		const isUndefined = !isMultiline && !isSingleline;
		const isNumeric = activeElement && ['input'].includes(activeElement.elementType) && ['number', 'tel'].includes(type);
		const isEmail = activeElement && ['input'].includes(activeElement.elementType) && ['email'].includes(type);
		const showPreview = isMultiline || isUndefined;
		return (
			<div className={styles.popup}>
				<div>
					{isSingleline && <div>
						{isNumeric && <div>
							<h1>Number generator</h1>
							<div
								className={`${styles.optionsGrid} ${styles.number} ${styles[type]}`}
								onMouseMove={this.setNumberPreview}
								onMouseLeave={this.resetNumberPreview}
								onClick={this.insertNumber}
								ref={(ref) => { this.numberPowerGrid = ref; }}
							>
								<div className={styles.singlelineOptions}>
									<div
										className={styles.selection}
										{...type !== 'tel' && { style: { width: `${((preview.numberPower || options.numberPower) / 10) * 100}%` } }}
									>
										<span className={`${styles.word} ${styles.active}`}>{text}</span>
									</div>
								</div>
							</div>
						</div>}
						{!isNumeric && <div>
							<h1>Text generator</h1>
							<div className={`${styles.optionsGrid} ${styles.singleline}`}>
								<div className={styles.singlelineOptions}>
									{!isEmail && text && text.split(' ').map((word, index) => <span
										onMouseMove={() => this.setSinglelinePreview(index + 1)}
										onMouseLeave={this.resetSinglelinePreview}
										onClick={this.insertWords}
										className={`${styles.word} ${index < (preview.words || options.words) ? styles.active : ''}`}
									>{word} </span>)}
									{isEmail && <span className={`${styles.word} ${styles.active} ${styles.email}`}>{text}</span>}
								</div>
							</div>
						</div>}
					</div>}
					{(isUndefined || isMultiline) && <div>
						<h1>Paragraph generator</h1>
						<label>
							<input type="checkbox" onChange={this.toggleHtml} checked={options.html} />
							Generate html
						</label>
						<div className={`${styles.optionsGrid} ${styles.multiline}`}
							onMouseMove={this.setMultilinePreview}
							onMouseLeave={this.resetMultilinePreview}
							onClick={this.insertMultilineText}
							ref={(ref) => { this.multilineOptionsGrid = ref; }}
						>
							<div className={styles.multilineOptions}>
								<div className={styles.selection}
									style={{
										height: `${((preview.paragraphs || options.paragraphs) / 10) * 100}%`,
										width: `${((preview.paragraphSentences || options.paragraphSentences) / 15) * 100}%`,
									}} />
								<div className={styles.optionsPreview}>
									{preview.paragraphs || options.paragraphs} paragraphs<br />
									x<br />
									{preview.paragraphSentences || options.paragraphSentences} senteces
								</div>
							</div>
						</div>
					</div>}

					<div className={`${styles.previewContainer} ${showPreview ? styles.visible : styles.hidden}`}>
						Preview:
						{options.html && <div
							ref={(ref) => { this.ref = ref; }}
							dangerouslySetInnerHTML={{ __html: text }}
							className={styles.preview}
							contentEditable
						/>}
						{!options.html && <textarea
							ref={(ref) => { this.ref = ref; }}
							value={text}
							className={styles.preview}
						/>}
					</div>

					<div className={styles.actionBar}>
						<button
							className={`success ${styles.confirm}`}
							onClick={this.action}
						>{(activeElement && activeElement.elementType !== 'body') ? 'Insert' : 'Copy to clipboard'}</button>
					</div>

					{debug && <div>
						Debug:
						<button onClick={this.getActiveElement}>get element & refresh</button>

						{activeElement.elementType},
						{activeElement.name},
						{activeElement.type}.
					</div>}
				</div>
			</div>
		);
	}
}

ReactDOM.render(<Popup />, document.getElementById('app'));

setTimeout(() => {
	window.analytics(['_setAccount', 'UA-115456762-1']);
	window.analytics(['_trackPageview']);
}, 1000);

